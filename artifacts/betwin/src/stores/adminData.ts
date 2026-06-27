import { reactive } from 'vue'
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
} from 'firebase/auth'
import {
  collection, doc, getDoc, setDoc, updateDoc, addDoc,
  onSnapshot, getDocs,
} from 'firebase/firestore'
import { auth, db } from '@/lib/firebase'

const ADMIN_EMAIL = 'admin@betwin.ug'

export interface User {
  id: string
  name: string
  phone: string
  email: string
  walletBalance: number
  status: 'active' | 'suspended' | 'banned'
  lastVisit: string
  createdAt: string
  country: string
  currency: string
}

export interface Bet {
  id: string
  userId: string
  ticketId: string
  match: string
  selection: string
  odds: number
  stake: number
  potentialWin: number
  status: 'pending' | 'won' | 'lost'
  sport: string
  placedAt: string
  settledAt?: string
}

export interface Transaction {
  id: string
  userId: string
  type: 'deposit' | 'withdrawal' | 'bet' | 'win' | 'cashout'
  amount: number
  method: string
  status: 'completed' | 'pending' | 'failed'
  reference: string
  createdAt: string
  name?: string
}

export interface Activity {
  id: string
  userId: string
  action: string
  details: string
  page: string
  ip: string
  createdAt: string
}

export const users = reactive<User[]>([])
export const bets = reactive<Bet[]>([])
export const transactions = reactive<Transaction[]>([])
export const activities = reactive<Activity[]>([])

export const siteSettings = reactive({
  siteName: 'BetWin',
  siteUrl: 'https://betwin.ug',
  adminEmail: ADMIN_EMAIL,
  adminPassword: 'admin123',
  currency: 'UGX',
  minDeposit: 1000,
  maxDeposit: 10000000,
  minWithdrawal: 5000,
  maxWithdrawal: 5000000,
  minBet: 500,
  maxBet: 1000000,
  maxOdds: 500,
  maintenanceMode: false,
  registrationEnabled: true,
  depositEnabled: true,
  withdrawalEnabled: true,
  bettingEnabled: true,
  siteBalance: 15000000,
})

export const adminAuth = reactive({
  isLoggedIn: false,
  username: '',
  loading: false,
})

let unsubUsers: (() => void) | null = null
let unsubBets: (() => void) | null = null
let unsubTxs: (() => void) | null = null
let unsubActivities: (() => void) | null = null

async function loadSiteSettings() {
  try {
    const snap = await getDoc(doc(db, 'siteSettings', 'main'))
    if (snap.exists()) {
      Object.assign(siteSettings, snap.data())
    } else {
      await setDoc(doc(db, 'siteSettings', 'main'), { ...siteSettings }).catch(() => {})
    }
  } catch {
    // Use defaults if Firestore not accessible
  }
}

function startAdminSubscriptions() {
  unsubUsers = onSnapshot(collection(db, 'users'), (snap) => {
    users.splice(0)
    snap.forEach(d => {
      const data = d.data()
      users.push({
        id: d.id,
        name: data.name || '',
        phone: data.phone || '',
        email: data.email || '',
        walletBalance: data.balance || data.walletBalance || 0,
        status: data.status || 'active',
        lastVisit: data.lastVisit || data.createdAt || new Date().toISOString(),
        createdAt: data.createdAt || new Date().toISOString(),
        country: data.country || 'Uganda',
        currency: data.currency || 'UGX',
      })
    })
  })

  unsubBets = onSnapshot(collection(db, 'bets'), (snap) => {
    bets.splice(0)
    snap.forEach(d => {
      const data = d.data()
      bets.push({
        id: d.id,
        userId: data.userId || '',
        ticketId: data.ticketId || d.id,
        match: data.match || (data.selections?.[0]?.matchName) || 'Unknown',
        selection: data.selection || (data.selections?.[0]?.label) || 'Unknown',
        odds: data.odds || data.combinedOdds || 0,
        stake: data.stake || 0,
        potentialWin: data.potentialWin || data.potentialReturn || 0,
        status: data.status || 'pending',
        sport: data.sport || 'Soccer',
        placedAt: data.placedAt || data.timestamp || new Date().toISOString(),
        settledAt: data.settledAt,
      })
    })
  })

  unsubTxs = onSnapshot(collection(db, 'transactions'), (snap) => {
    transactions.splice(0)
    snap.forEach(d => {
      const data = d.data()
      transactions.push({
        id: d.id,
        userId: data.userId || '',
        type: data.type || 'deposit',
        amount: data.amount || 0,
        method: data.method || '',
        status: data.status || 'completed',
        reference: data.reference || d.id,
        createdAt: data.createdAt || data.date || new Date().toISOString(),
        name: data.name,
      })
    })
  })

  unsubActivities = onSnapshot(collection(db, 'activities'), (snap) => {
    activities.splice(0)
    snap.forEach(d => {
      const data = d.data()
      activities.push({
        id: d.id,
        userId: data.userId || '',
        action: data.action || '',
        details: data.details || '',
        page: data.page || '/',
        ip: data.ip || '',
        createdAt: data.createdAt || new Date().toISOString(),
      })
    })
  })
}

function stopAdminSubscriptions() {
  unsubUsers?.(); unsubBets?.(); unsubTxs?.(); unsubActivities?.()
  unsubUsers = unsubBets = unsubTxs = unsubActivities = null
}

export async function adminLogin(username: string, password: string): Promise<boolean> {
  if (username !== 'admin') return false

  adminAuth.loading = true
  try {
    // Load siteSettings to get current admin password
    await loadSiteSettings()

    if (password !== siteSettings.adminPassword) return false

    // Sign into Firebase Auth for Firestore access
    try {
      await signInWithEmailAndPassword(auth, ADMIN_EMAIL, password)
    } catch (e: any) {
      if (e.code === 'auth/user-not-found' || e.code === 'auth/invalid-credential' || e.code === 'auth/wrong-password') {
        try {
          await createUserWithEmailAndPassword(auth, ADMIN_EMAIL, password)
        } catch {}
      }
    }

    // Reload siteSettings now that we're authenticated
    await loadSiteSettings()

    adminAuth.isLoggedIn = true
    adminAuth.username = username
    startAdminSubscriptions()
    return true
  } finally {
    adminAuth.loading = false
  }
}

export async function adminLogout() {
  adminAuth.isLoggedIn = false
  adminAuth.username = ''
  stopAdminSubscriptions()
  users.splice(0); bets.splice(0); transactions.splice(0); activities.splice(0)
  await signOut(auth).catch(() => {})
}

export function getUserById(id: string): User | undefined {
  return users.find(u => u.id === id)
}

export function getUserBets(userId: string): Bet[] {
  return bets.filter(b => b.userId === userId)
}

export function getUserTransactions(userId: string): Transaction[] {
  return transactions.filter(t => t.userId === userId)
}

export function getUserActivities(userId: string): Activity[] {
  return activities.filter(a => a.userId === userId)
}

export async function adjustWallet(userId: string, amount: number, type: 'add' | 'deduct', method = 'Admin Adjustment'): Promise<void> {
  const user = users.find(u => u.id === userId)
  if (!user) return
  const delta = type === 'add' ? amount : -amount
  const newBalance = Math.max(0, user.walletBalance + delta)
  user.walletBalance = newBalance
  const now = new Date().toISOString()
  await Promise.all([
    updateDoc(doc(db, 'users', userId), { balance: newBalance }),
    addDoc(collection(db, 'transactions'), {
      userId, type: type === 'add' ? 'deposit' : 'withdrawal',
      amount, method, status: 'completed',
      reference: 'ADM-' + Date.now(), createdAt: now,
      name: type === 'add' ? `Admin Credit — ${method}` : `Admin Debit — ${method}`,
      positive: type === 'add', date: now,
    }),
    addDoc(collection(db, 'activities'), {
      userId, action: type === 'add' ? 'Admin Credit' : 'Admin Debit',
      details: `Admin ${type === 'add' ? 'added' : 'deducted'} UGX ${amount.toLocaleString()} (${method})`,
      page: '/admin', ip: '127.0.0.1', createdAt: now,
    }),
  ])
}

export async function updateUserStatus(userId: string, status: 'active' | 'suspended' | 'banned'): Promise<void> {
  const user = users.find(u => u.id === userId)
  if (!user) return
  user.status = status
  await updateDoc(doc(db, 'users', userId), { status })
}

export async function updateBetStatus(betId: string, status: 'pending' | 'won' | 'lost'): Promise<void> {
  const bet = bets.find(b => b.id === betId)
  if (!bet) return
  bet.status = status
  const updates: Record<string, string> = { status }
  if (status !== 'pending') updates.settledAt = new Date().toISOString()
  await updateDoc(doc(db, 'bets', betId), updates)
}

export async function updateTransactionStatus(txId: string, status: 'completed' | 'pending' | 'failed'): Promise<void> {
  const tx = transactions.find(t => t.id === txId)
  if (!tx) return
  tx.status = status
  await updateDoc(doc(db, 'transactions', txId), { status })
}

export async function saveSiteSettings(updates: Partial<typeof siteSettings>): Promise<void> {
  Object.assign(siteSettings, updates)
  await updateDoc(doc(db, 'siteSettings', 'main'), updates)
}

export async function withdrawSiteBalance(amount: number, method: string): Promise<void> {
  if (amount <= 0 || amount > siteSettings.siteBalance) return
  siteSettings.siteBalance = Math.max(0, siteSettings.siteBalance - amount)
  const now = new Date().toISOString()
  await Promise.all([
    updateDoc(doc(db, 'siteSettings', 'main'), { siteBalance: siteSettings.siteBalance }),
    addDoc(collection(db, 'transactions'), {
      userId: 'admin', type: 'withdrawal',
      amount, method, status: 'completed',
      reference: 'SITE-' + Date.now(), createdAt: now,
      name: `Site Withdrawal via ${method}`, positive: false, date: now,
    }),
  ])
}

export function formatDate(iso: string): string {
  const date = new Date(iso)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const mins = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)
  if (mins < 1) return 'Just now'
  if (mins < 60) return `${mins}m ago`
  if (hours < 24) return `${hours}h ago`
  if (days === 1) return 'Yesterday'
  if (days < 7) return `${days} days ago`
  return date.toLocaleDateString('en-UG', { day: '2-digit', month: 'short', year: 'numeric' })
}

export function formatFullDate(iso: string): string {
  return new Date(iso).toLocaleString('en-UG', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}
