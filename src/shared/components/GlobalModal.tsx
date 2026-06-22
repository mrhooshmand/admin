import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog"
import { useModalStore } from "@/app/store/modalStore"

const sizeClasses = {
  sm: 'sm:max-w-sm',
  md: 'sm:max-w-md',
  lg: 'sm:max-w-lg',
  xl: 'sm:max-w-xl',
  full: 'sm:max-w-[90vw]',
}

export function GlobalModal() {
  const { isOpen, options, closeModal } = useModalStore()

  if (!options) return null

  return (
    <Dialog open={isOpen} onOpenChange={closeModal}>
      <DialogContent className={sizeClasses[options.size || 'md']}>
        {(options.title || options.description) && (
          <DialogHeader>
            {options.title && (
              <DialogTitle>{options.title}</DialogTitle>
            )}
            {options.description && (
              <DialogDescription>{options.description}</DialogDescription>
            )}
          </DialogHeader>
        )}
        {options.content}
      </DialogContent>
    </Dialog>
  )
}