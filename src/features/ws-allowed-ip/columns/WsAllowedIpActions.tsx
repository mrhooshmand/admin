import { Pencil, UserCheck } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { WsAllowedIp } from "@/features/ws-allowed-ip/types";

interface WsAllowedIpActionsProps {
    row: WsAllowedIp;
    isMutating?: boolean;
    onEdit: (row: WsAllowedIp) => void;
    onCheck: (row: WsAllowedIp) => void;
}

export function WsAllowedIpActions({
    row,
    isMutating = false,
    onEdit,
    onCheck,
}: WsAllowedIpActionsProps) {
    return (
        <div className="flex items-center justify-start gap-0.5">
            <Button variant="ghost" size="icon" className="size-8 rounded-md text-muted-foreground shadow-none hover:bg-primary/10 hover:text-primary" disabled={isMutating} onClick={() => onEdit(row)}>
                <Pencil className="size-4" />
            </Button>
            <Button variant="ghost" size="icon" className="size-8 rounded-md text-muted-foreground shadow-none hover:bg-primary/10 hover:text-primary" disabled={isMutating} onClick={() => onCheck(row)}>
                <UserCheck className="size-4" />
            </Button>
        </div>
    );
}
