import { create } from 'zustand'

interface ConfirmOptions {
  title: string
  description: string
  confirmText?: string
  cancelText?: string
  confirmVariant?: 'default' | 'destructive'
  onConfirm: () => void | Promise<void>
}

interface ConfirmStore {
  isOpen: boolean
  isLoading: boolean
  options: ConfirmOptions | null
  showConfirm: (opts: ConfirmOptions) => void
  closeConfirm: () => void
  setLoading: (loading: boolean) => void
}

export const useConfirmStore = create<ConfirmStore>((set) => ({
  isOpen: false,
  isLoading: false,
  options: null,

  showConfirm: (opts) =>
    set({
      isOpen: true,
      options: opts,
      isLoading: false,
    }),

  closeConfirm: () =>
    set({
      isOpen: false,
      options: null,
      isLoading: false,
    }),

  setLoading: (loading) =>
    set({
      isLoading: loading,
    }),
}))