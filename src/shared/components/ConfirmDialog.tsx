import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/shared/ui/alert-dialog";
import { useConfirmStore } from "@/app/store/confirmStore";

export function ConfirmDialog() {
  const { isOpen, isLoading, options, closeConfirm, setLoading } = useConfirmStore();

  const handleConfirm = async () => {
    if (!options) return;
    setLoading(true);
    try {
      await options.onConfirm();
    } finally {
      setLoading(false);
      closeConfirm();
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={closeConfirm}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{options?.title || "Are you sure?"}</AlertDialogTitle>
          <AlertDialogDescription>
            {options?.description || "This action cannot be undone."}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>
            {options?.cancelText || "Cancel"}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            className={
              options?.confirmVariant === "destructive"
                ? "bg-red-500 hover:bg-red-600"
                : ""
            }
            disabled={isLoading}
          >
            {isLoading ? "Deleting..." : options?.confirmText || "Confirm"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}