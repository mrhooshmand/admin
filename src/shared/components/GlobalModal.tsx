import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog"
import { useModalStore } from "@/app/store/modalStore"
import { useEffect } from "react"

const sizeClasses = {
  sm: 'sm:max-w-sm',
  md: 'sm:max-w-md',
  lg: 'sm:max-w-lg',
  xl: 'sm:max-w-xl',
  full: 'sm:max-w-[90vw]',
}

export function GlobalModal() {
  const { modals, closeModal } = useModalStore()

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        const openModals = modals.filter(m => m.isOpen)
        if (openModals.length > 0) {
          const topModal = openModals[openModals.length - 1]
          if (!topModal.disableEscape) {
            closeModal(topModal.id)
          }
        }
      }
    }
    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [modals, closeModal])

  const openModals = modals.filter(m => m.isOpen)

  if (openModals.length === 0) return null

  return (
    <>
      {openModals.map((modal, index) => {
        const isTop = index === openModals.length - 1

        return (
          <Dialog
            key={modal.id}
            open={modal.isOpen}
            onOpenChange={(open) => {
              if (!open && isTop) {
                closeModal(modal.id)
              }
            }}
          >
            <DialogContent
              className={sizeClasses[modal.size || 'md']}
              style={{
                transform: `translateY(${index * 20}px) scale(${1 - index * 0.02})`,
                zIndex: 1000 + index,
              }}
              onPointerDownOutside={(e) => {
                if (isTop && modal.disableOutsideClick) {
                  e.preventDefault()
                }
              }}
              onEscapeKeyDown={(e) => {
                if (isTop && modal.disableEscape) {
                  e.preventDefault()
                }
              }}
            >
              {(modal.title || modal.description) && (
                <DialogHeader>
                  {modal.title && (
                    <DialogTitle>{modal.title}</DialogTitle>
                  )}
                  {modal.description && (
                    <DialogDescription>{modal.description}</DialogDescription>
                  )}
                </DialogHeader>
              )}
              {modal.content}
            </DialogContent>
          </Dialog>
        )
      })}
    </>
  )
}