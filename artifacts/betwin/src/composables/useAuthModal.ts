import { ref, reactive } from 'vue'
import {
  GoogleAuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth'
import {
  doc, getDoc, setDoc, updateDoc, addDoc, collection,
  onSnapshot, query, where,
} from 'firebase/firestore'
import { auth, db } from '@/lib/firebase'

const ADMIN_EMAIL = 'admin@betwin.ug'

export interface AuthUser {
  uid: string
  name: string
  phone: string
  email: string
  balance: number
}

export interface UserTx {
  id: string
  type: string
  name: string
  amount: number
  positive: boolean
  date: string
}

type ModalType = 'login' | 'register' | null

const modalType = ref<ModalType>(null)
const currentUser = ref<AuthUser | null>(null)
const needsPhone = ref(false)
const authLoading = ref(false)
const userTransactions = reactive<UserTx[]>([])

let unsubTransactions: (() => void) | null = null

async function syncUserProfile(uid: string) {
  const snap = await getDoc(doc(db, 'users', uid))
  if (snap.exists()) {
    const d = snap.data()
    currentUser.value = {
      uid,
      name: d.name || '',
      phone: d.phone || '',
      email: d.email || '',
      balance: d.balance || 0,
    }
    updateDoc(doc(db, 'users', uid), { lastVisit: new Date().toISOString() }).catch(() => {})
    if (unsubTransactions) unsubTransactions()
    unsubTransactions = onSnapshot(
      query(collection(db, 'transactions'), where('userId', '==', uid)),
      (snap) => {
        userTransactions.splice(0)
        const txs = snap.docs.map(d => ({ id: d.id, ...d.data() } as UserTx))
        txs.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        userTransactions.push(...txs)
      }
    )
  }
}

onAuthStateChanged(auth, async (firebaseUser) => {
  if (firebaseUser && firebaseUser.email !== ADMIN_EMAIL) {
    await syncUserProfile(firebaseUser.uid)
  } else {
    if (unsubTransactions) { unsubTransactions(); unsubTransactions = null }
    currentUser.value = null
    userTransactions.splice(0)
  }
})

export function useAuthModal() {
  function openLogin() { modalType.value = 'login' }
  function openRegister() { modalType.value = 'register' }
  function closeModal() { modalType.value = null; needsPhone.value = false }

  async function loginWithEmail(email: string, password: string): Promise<string | null> {
    try {
      authLoading.value = true
      await signInWithEmailAndPassword(auth, email, password)
      closeModal()
      return null
    } catch (e: any) {
      if (e.code === 'auth/invalid-credential' || e.code === 'auth/user-not-found' || e.code === 'auth/wrong-password') {
        return 'Invalid email or password'
      }
      return e.message || 'Login failed'
    } finally {
      authLoading.value = false
    }
  }

  async function registerWithEmail(name: string, phone: string, email: string, password: string): Promise<string | null> {
    try {
      authLoading.value = true
      const cred = await createUserWithEmailAndPassword(auth, email, password)
      const uid = cred.user.uid
      const now = new Date().toISOString()
      const profile = {
        uid, name, phone, email, balance: 0, status: 'active',
        createdAt: now, lastVisit: now, country: 'Uganda', currency: 'UGX',
      }
      await setDoc(doc(db, 'users', uid), profile)
      currentUser.value = { uid, name, phone, email, balance: 0 }
      closeModal()
      return null
    } catch (e: any) {
      if (e.code === 'auth/email-already-in-use') return 'Email already registered'
      if (e.code === 'auth/weak-password') return 'Password must be at least 6 characters'
      return e.message || 'Registration failed'
    } finally {
      authLoading.value = false
    }
  }

  async function loginWithGoogle(): Promise<string | null> {
    try {
      authLoading.value = true
      const provider = new GoogleAuthProvider()
      const cred = await signInWithPopup(auth, provider)
      const uid = cred.user.uid
      const snap = await getDoc(doc(db, 'users', uid))
      if (!snap.exists()) {
        const now = new Date().toISOString()
        const profile = {
          uid, name: cred.user.displayName || 'User', phone: '',
          email: cred.user.email || '', balance: 0, status: 'active',
          createdAt: now, lastVisit: now, country: 'Uganda', currency: 'UGX',
        }
        await setDoc(doc(db, 'users', uid), profile)
        currentUser.value = { uid, name: profile.name, phone: '', email: profile.email, balance: 0 }
        needsPhone.value = true
      } else {
        const d = snap.data()
        currentUser.value = { uid, name: d.name, phone: d.phone || '', email: d.email, balance: d.balance || 0 }
        if (!d.phone) {
          needsPhone.value = true
        } else {
          closeModal()
        }
      }
      return null
    } catch (e: any) {
      if (e.code === 'auth/popup-closed-by-user') return null
      return e.message || 'Google login failed'
    } finally {
      authLoading.value = false
    }
  }

  async function savePhone(phone: string): Promise<void> {
    if (!currentUser.value) return
    await updateDoc(doc(db, 'users', currentUser.value.uid), { phone })
    currentUser.value.phone = phone
    needsPhone.value = false
    closeModal()
  }

  async function logout() {
    await signOut(auth)
    currentUser.value = null
  }

  async function addToBalance(amount: number) {
    if (!currentUser.value) return
    const newBal = Math.max(0, currentUser.value.balance + amount)
    currentUser.value.balance = newBal
    updateDoc(doc(db, 'users', currentUser.value.uid), { balance: newBal }).catch(() => {})
  }

  async function depositFunds(amount: number, method: string) {
    if (!currentUser.value) return
    const newBal = currentUser.value.balance + amount
    currentUser.value.balance = newBal
    const now = new Date().toISOString()
    updateDoc(doc(db, 'users', currentUser.value.uid), { balance: newBal }).catch(() => {})
    addDoc(collection(db, 'transactions'), {
      userId: currentUser.value.uid,
      type: 'deposit',
      name: `Deposit via ${method}`,
      amount,
      positive: true,
      date: now,
      method,
      status: 'completed',
      reference: 'DEP-' + Date.now(),
    }).catch(() => {})
  }

  async function withdrawFunds(amount: number, method: string) {
    if (!currentUser.value || amount > currentUser.value.balance) return
    const newBal = currentUser.value.balance - amount
    currentUser.value.balance = newBal
    const now = new Date().toISOString()
    updateDoc(doc(db, 'users', currentUser.value.uid), { balance: newBal }).catch(() => {})
    addDoc(collection(db, 'transactions'), {
      userId: currentUser.value.uid,
      type: 'withdrawal',
      name: `Withdrawal via ${method}`,
      amount,
      positive: false,
      date: now,
      method,
      status: 'completed',
      reference: 'WD-' + Date.now(),
    }).catch(() => {})
  }

  async function cashoutFunds(amount: number, ticketId: string) {
    if (!currentUser.value) return
    const newBal = currentUser.value.balance + amount
    currentUser.value.balance = newBal
    const now = new Date().toISOString()
    updateDoc(doc(db, 'users', currentUser.value.uid), { balance: newBal }).catch(() => {})
    addDoc(collection(db, 'transactions'), {
      userId: currentUser.value.uid,
      type: 'cashout',
      name: `Cashout — ${ticketId}`,
      amount,
      positive: true,
      date: now,
      method: 'Cashout',
      status: 'completed',
      reference: ticketId,
    }).catch(() => {})
  }

  async function updateProfile(name: string, phone: string) {
    if (!currentUser.value) return
    currentUser.value.name = name
    currentUser.value.phone = phone
    updateDoc(doc(db, 'users', currentUser.value.uid), { name, phone }).catch(() => {})
  }

  function login(user: AuthUser) {
    currentUser.value = user
    closeModal()
  }

  return {
    modalType, currentUser, needsPhone, authLoading, userTransactions,
    openLogin, openRegister, closeModal, login, logout, addToBalance,
    loginWithEmail, registerWithEmail, loginWithGoogle, savePhone,
    depositFunds, withdrawFunds, cashoutFunds, updateProfile,
  }
}
