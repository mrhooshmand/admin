import {Button} from "@/shared/ui/button.tsx";
import {Plus} from "lucide-react";
import {useLocale} from "@/app/providers/LocaleProvider";

interface PageActionProps {
    onAdd?: () => void;
}

export function RolesToolbar({onAdd}: PageActionProps) {
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
        </>
    )
}
