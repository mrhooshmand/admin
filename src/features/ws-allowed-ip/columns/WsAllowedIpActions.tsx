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
        <div className="flex items-center justify-center gap-1">
            <Button variant="ghost" size="icon" disabled={isMutating} onClick={() => onEdit(row)}>
                <Pencil className="size-4" />
            </Button>
            <Button variant="ghost" size="icon" disabled={isMutating} onClick={() => onCheck(row)}>
                <UserCheck className="size-4" />
            </Button>
        </div>
    );
}
