import { ref } from 'vue'

type ModalType = 'login' | 'register' | null

export interface AuthUser {
  name: string
  phone: string
  balance: number
}

const modalType = ref<ModalType>(null)
const currentUser = ref<AuthUser | null>(null)

export function useAuthModal() {
  function openLogin() { modalType.value = 'login' }
  function openRegister() { modalType.value = 'register' }
  function closeModal() { modalType.value = null }

  function login(user: AuthUser) {
    currentUser.value = user
    closeModal()
  }

  function logout() {
    currentUser.value = null
  }

  function addToBalance(amount: number) {
    if (currentUser.value) {
      currentUser.value.balance += amount
    }
  }

  return { modalType, currentUser, openLogin, openRegister, closeModal, login, logout, addToBalance }
}
