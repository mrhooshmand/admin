import { create } from 'zustand'
import { ReactNode } from 'react'

interface ModalOptions {
  title?: string
  description?: string
  content: ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  onClose?: () => void
}

interface ModalStore {
  isOpen: boolean
  options: ModalOptions | null
  openModal: (opts: ModalOptions) => void
  closeModal: () => void
}

export const useModalStore = create<ModalStore>((set) => ({
  isOpen: false,
  options: null,

  openModal: (opts) =>
    set({
      isOpen: true,
      options: opts,
    }),

  closeModal: () =>
    set((state) => {
      if (state.options?.onClose) {
        state.options.onClose()
      }
      return {
        isOpen: false,
        options: null,
      }
    }),
}))