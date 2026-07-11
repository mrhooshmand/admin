import {Button} from "@/shared/ui/button.tsx";
import {Plus, FileSpreadsheetIcon} from "lucide-react";

interface PageActionProps {
    onAdd?: () => void;
    onExport?: () => void;
}

export function UsersToolbar({onAdd, onExport}: PageActionProps) {
    return (
        <>
            <Button
                variant="secondary"
                size="icon"
                onClick={onAdd}
            >
                <Plus/>
            </Button>
            <Button className="accent-green-300" variant="secondary" onClick={onExport}>
                <FileSpreadsheetIcon/>
            </Button>
        </>
    )
}