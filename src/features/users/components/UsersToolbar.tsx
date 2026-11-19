import {Button} from "@/shared/ui/button.tsx";
import {Plus, FileSpreadsheetIcon} from "lucide-react";
import {useLocale} from "@/app/providers/LocaleProvider";

interface PageActionProps {
    onAdd?: () => void;
    onExport?: () => void;
}

export function UsersToolbar({onAdd, onExport}: PageActionProps) {
    const {t} = useLocale();

    return (
        <>
            <Button
                variant="secondary"
                size="icon"
                aria-label={t("common.create")}
                title={t("common.create")}
                onClick={onAdd}
            >
                <Plus/>
            </Button>
            <Button
                className="accent-green-300"
                variant="secondary"
                size="icon"
                aria-label={t("common.export")}
                title={t("common.export")}
                onClick={onExport}
            >
                <FileSpreadsheetIcon/>
            </Button>
        </>
    )
}
