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
                variant="outline"
                size="icon"
                className="size-9 rounded-md border-border bg-card text-muted-foreground shadow-none hover:border-primary/30 hover:bg-primary/10 hover:text-primary"
                onClick={onAdd}
            >
                <Plus/>
            </Button>
            <Button
                variant="outline"
                size="icon"
                className="size-9 rounded-md border-border bg-card text-emerald-600 shadow-none hover:border-emerald-500/30 hover:bg-emerald-500/10"
                onClick={onExport}
            >
                <FileSpreadsheetIcon/>
            </Button>
        </>
    )
}