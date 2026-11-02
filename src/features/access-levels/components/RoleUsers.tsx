import { useQuery } from "@tanstack/react-query";
import { useLocale } from "@/app/providers/LocaleProvider";
import { Badge } from "@/shared/ui/badge";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/shared/ui/table";
import { getRoleUsers } from "@/features/access-levels/api/accessLevelApi";

function statusVariant(status: string) {
    if (status === "enable") return "default" as const;
    if (status === "disable" || status === "block") return "destructive" as const;
    return "secondary" as const;
}

export function RoleUsers({ levelId }: { levelId: number }) {
    const { t } = useLocale();
    const query = useQuery({
        queryKey: ["access-level-users", levelId],
        queryFn: () => getRoleUsers(levelId),
    });

    if (query.isLoading) {
        return <p className="text-sm text-muted-foreground">{t("common.loading")}</p>;
    }
    if (query.isError) {
        return <p className="text-sm text-destructive">{query.error.message}</p>;
    }
    if (!query.data?.length) {
        return <p className="text-sm text-muted-foreground">{t("accessLevels.emptyUsers")}</p>;
    }

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>#</TableHead>
                    <TableHead>{t("accessLevels.name")}</TableHead>
                    <TableHead>{t("accessLevels.status")}</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {query.data.map((user, index) => (
                    <TableRow key={`${user.name}-${index}`}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>{user.name}</TableCell>
                        <TableCell>
                            <Badge variant={statusVariant(user.status)}>{user.status}</Badge>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}
