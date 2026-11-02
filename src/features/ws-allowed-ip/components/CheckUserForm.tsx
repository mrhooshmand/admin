import { useQuery } from "@tanstack/react-query";
import { useIsMutating } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useLocale } from "@/app/providers/LocaleProvider";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { Badge } from "@/shared/ui/badge";
import { getRoutes } from "@/features/ws-allowed-ip/api/wsAllowedIpApi";
import { checkUserSchema, CheckUserFormData } from "@/features/ws-allowed-ip/schemas";
import { CheckUserPayload, WsAllowedIp } from "@/features/ws-allowed-ip/types";

const selectClass =
    "h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50";

interface CheckUserFormProps {
    row: WsAllowedIp;
    onSave: (payload: CheckUserPayload) => void;
    onCancel: () => void;
}

export function CheckUserForm({ row, onSave, onCancel }: CheckUserFormProps) {
    const { t } = useLocale();
    const saving = useIsMutating({ mutationKey: ["ws-allowed-ips"] }) > 0;
    const routesQuery = useQuery({
        queryKey: ["ws-routes"],
        queryFn: getRoutes,
    });
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<CheckUserFormData>({
        resolver: zodResolver(checkUserSchema),
        defaultValues: {
            search_flight_departure: "",
            search_flight_arrival: "",
            date: "",
        },
    });

    const submit = (values: CheckUserFormData) => {
        onSave({
            id: row.id,
            user: row.user,
            pass: row.pass,
            ...values,
        });
    };

    return (
        <form className="grid gap-4 py-2" onSubmit={handleSubmit(submit)}>
            <div className="grid gap-1 text-sm">
                <div>{row.customer || "—"}</div>
                <div className="text-muted-foreground">{row.ip}</div>
                <div className="flex gap-2">
                    <span>{row.user}</span>
                    <Badge variant={row.active ? "default" : "destructive"}>
                        {row.active ? t("wsAllowed.active") : t("wsAllowed.inactive")}
                    </Badge>
                </div>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
                <div className="grid gap-2">
                    <Label>{t("wsAllowed.departure")}</Label>
                    <select className={selectClass} {...register("search_flight_departure")}>
                        <option value="">{t("common.select")}</option>
                        {routesQuery.data?.map((route) => (
                            <option key={`from-${route.id}`} value={route.id}>
                                {route.title}
                            </option>
                        ))}
                    </select>
                    {errors.search_flight_departure && (
                        <p className="text-sm text-destructive">{errors.search_flight_departure.message}</p>
                    )}
                </div>
                <div className="grid gap-2">
                    <Label>{t("wsAllowed.arrival")}</Label>
                    <select className={selectClass} {...register("search_flight_arrival")}>
                        <option value="">{t("common.select")}</option>
                        {routesQuery.data?.map((route) => (
                            <option key={`to-${route.id}`} value={route.id}>
                                {route.title}
                            </option>
                        ))}
                    </select>
                    {errors.search_flight_arrival && (
                        <p className="text-sm text-destructive">{errors.search_flight_arrival.message}</p>
                    )}
                </div>
                <div className="grid gap-2">
                    <Label>{t("wsAllowed.date")}</Label>
                    <Input type="date" {...register("date")} />
                    {errors.date && <p className="text-sm text-destructive">{errors.date.message}</p>}
                </div>
            </div>
            {routesQuery.isLoading && (
                <p className="text-sm text-muted-foreground">{t("common.loading")}</p>
            )}
            <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={onCancel}>
                    {t("common.cancel")}
                </Button>
                <Button type="submit" disabled={saving}>
                    {saving ? t("common.loading") : t("common.confirm")}
                </Button>
            </div>
        </form>
    );
}
