import { ref } from 'vue'

type ModalType = 'login' | 'register' | null

const modalType = ref<ModalType>(null)

export function useAuthModal() {
  function openLogin() { modalType.value = 'login' }
  function openRegister() { modalType.value = 'register' }
  function closeModal() { modalType.value = null }

  return { modalType, openLogin, openRegister, closeModal }
}
