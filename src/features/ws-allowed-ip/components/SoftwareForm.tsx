import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useIsMutating } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useLocale } from "@/app/providers/LocaleProvider";
import { Button } from "@/shared/ui/button";
import { Label } from "@/shared/ui/label";
import { getSoftwareNames } from "@/features/ws-allowed-ip/api/wsAllowedIpApi";
import { softwareSchema, SoftwareFormData } from "@/features/ws-allowed-ip/schemas";

const selectClass =
    "h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50";

interface SoftwareFormProps {
    current: string;
    onSave: (softwareName: string) => void;
    onCancel: () => void;
}

export function SoftwareForm({ current, onSave, onCancel }: SoftwareFormProps) {
    const { t } = useLocale();
    const saving = useIsMutating({ mutationKey: ["ws-allowed-ips"] }) > 0;
    const namesQuery = useQuery({
        queryKey: ["ws-software-names"],
        queryFn: getSoftwareNames,
    });

    const known = namesQuery.data ?? [];
    const matched = known.find((item) => item.id === current || item.title === current);
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<SoftwareFormData>({
        resolver: zodResolver(softwareSchema),
        defaultValues: { software_name: current },
    });

    useEffect(() => {
        reset({ software_name: matched?.id || current });
    }, [current, matched?.id, reset]);

    return (
        <form className="grid gap-4 py-2" onSubmit={handleSubmit((values) => onSave(values.software_name))}>
            <div className="grid gap-2">
                <Label htmlFor="software-name">{t("wsAllowed.softwareName")}</Label>
                <select id="software-name" className={selectClass} {...register("software_name")}>
                    <option value="">{t("common.select")}</option>
                    {!matched && current && <option value={current}>{current}</option>}
                    {known.map((item) => (
                        <option key={item.id} value={item.id || item.title}>
                            {item.title}
                        </option>
                    ))}
                </select>
                {errors.software_name && (
                    <p className="text-sm text-destructive">{errors.software_name.message}</p>
                )}
            </div>
            <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={onCancel}>
                    {t("common.cancel")}
                </Button>
                <Button type="submit" disabled={saving}>
                    {saving ? t("common.loading") : t("common.save")}
                </Button>
            </div>
        </form>
    );
}
