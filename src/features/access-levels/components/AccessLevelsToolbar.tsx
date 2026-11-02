import { Plus } from "lucide-react";
import { Button } from "@/shared/ui/button";

interface AccessLevelsToolbarProps {
    onAdd?: () => void;
}

export function AccessLevelsToolbar({ onAdd }: AccessLevelsToolbarProps) {
    return (
        <Button variant="secondary" size="icon" onClick={onAdd}>
            <Plus />
        </Button>
    );
}
