import {Button} from "@/shared/ui/button.tsx";
import {Plus} from "lucide-react";

interface PageActionProps {
    onAdd?: () => void;
    onExport?: () => void;
}

export function RolesToolbar({onAdd}: PageActionProps) {
    return (
        <>
            <Button
                variant="secondary"
                size="icon"
                onClick={onAdd}
            >
                <Plus/>
            </Button>
        </>
    )
}