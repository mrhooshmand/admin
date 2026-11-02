import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useIsMutating } from "@tanstack/react-query";
import { useLocale } from "@/app/providers/LocaleProvider";
import { Button } from "@/shared/ui/button";
import { Checkbox } from "@/shared/ui/checkbox";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { getLevelInfo, getModules } from "@/features/access-levels/api/accessLevelApi";
import { PermissionTree } from "@/features/access-levels/components/PermissionTree";
import { collectCheckedIds } from "@/features/access-levels/lib/permissions";
import { accessLevelSchema } from "@/features/access-levels/schemas";
import { AccessLevel, AccessLevelPayload } from "@/features/access-levels/types/types";

interface AccessLevelFormProps {
    editing: AccessLevel | null;
    onSave: (data: AccessLevelPayload) => void;
    onCancel: () => void;
}

export function AccessLevelForm({ editing, onSave, onCancel }: AccessLevelFormProps) {
    const { t } = useLocale();
    const saving = useIsMutating({ mutationKey: ["access-levels"] }) > 0;
    const [modulesSelected, setModulesSelected] = useState<string[]>(
        editing?.module ? editing.module.split(",").filter(Boolean) : [],
    );
    const [title, setTitle] = useState(editing?.title ?? "");
    const [active, setActive] = useState(editing ? editing.status === 1 : true);
    const [checked, setChecked] = useState<Set<string>>(new Set());
    const [expanded, setExpanded] = useState(false);
    const [formError, setFormError] = useState("");

    const modulesQuery = useQuery({
        queryKey: ["access-level-modules"],
        queryFn: getModules,
    });

    const moduleKey = useMemo(() => [...modulesSelected].sort().join(","), [modulesSelected]);
    const infoQuery = useQuery({
        queryKey: ["access-level-info", editing?.id ?? 0, moduleKey],
        queryFn: () => getLevelInfo(editing?.id ?? 0, modulesSelected),
        enabled: modulesSelected.length > 0,
    });

    useEffect(() => {
        if (!infoQuery.data) return;
        setTitle(infoQuery.data.title || editing?.title || "");
        setActive(infoQuery.data.active);
        setChecked(new Set(collectCheckedIds(infoQuery.data.nodes)));
    }, [infoQuery.data, editing?.title]);

    const toggleModule = (id: string, value: boolean) => {
        setModulesSelected((current) =>
            value ? [...current, id] : current.filter((item) => item !== id),
        );
    };

    const togglePermission = (id: string, value: boolean) => {
        setChecked((current) => {
            const next = new Set(current);
            if (value) next.add(id);
            else next.delete(id);
            return next;
        });
    };

    const submit = () => {
        const parsed = accessLevelSchema.safeParse({
            title,
            roles: modulesSelected,
            status: active ? "1" : "0",
            permissions: [...checked],
        });
        if (!parsed.success) {
            setFormError(parsed.error.issues[0]?.message ?? "");
            return;
        }
        setFormError("");
        onSave(parsed.data);
    };

    return (
        <div className="grid max-h-[70vh] gap-4 overflow-y-auto py-2 pe-1">
            <div className="grid gap-2">
                <Label>{t("accessLevels.module")}</Label>
                {modulesQuery.isLoading && (
                    <p className="text-sm text-muted-foreground">{t("common.loading")}</p>
                )}
                {modulesQuery.isError && (
                    <p className="text-sm text-destructive">{modulesQuery.error.message}</p>
                )}
                <div className="flex flex-wrap gap-3">
                    {modulesQuery.data?.map((module) => (
                        <label key={module.id} className="flex items-center gap-2 text-sm">
                            <Checkbox
                                checked={modulesSelected.includes(module.id)}
                                onCheckedChange={(value) => toggleModule(module.id, value === true)}
                            />
                            <span>{module.title}</span>
                        </label>
                    ))}
                </div>
            </div>

            {modulesSelected.length > 0 && (
                <>
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="grid gap-2">
                            <Label htmlFor="access-level-title">{t("accessLevels.role")}</Label>
                            <Input
                                id="access-level-title"
                                value={title}
                                onChange={(event) => setTitle(event.target.value)}
                            />
                        </div>
                        <label className="flex items-center gap-2 text-sm md:mt-7">
                            <Checkbox
                                checked={active}
                                onCheckedChange={(value) => setActive(value === true)}
                            />
                            <span>{t("accessLevels.active")}</span>
                        </label>
                    </div>

                    <div className="flex items-center justify-between">
                        <Label>{t("accessLevels.permissions")}</Label>
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => setExpanded((value) => !value)}
                        >
                            {expanded ? t("accessLevels.closeAll") : t("accessLevels.openAll")}
                        </Button>
                    </div>
                    {infoQuery.isLoading && (
                        <p className="text-sm text-muted-foreground">{t("common.loading")}</p>
                    )}
                    {infoQuery.isError && (
                        <p className="text-sm text-destructive">{infoQuery.error.message}</p>
                    )}
                    {infoQuery.data && (
                        <PermissionTree
                            key={expanded ? "open" : "closed"}
                            nodes={infoQuery.data.nodes}
                            checked={checked}
                            onToggle={togglePermission}
                            defaultOpen={expanded}
                        />
                    )}
                </>
            )}

            {formError && <p className="text-sm text-destructive">{formError}</p>}

            <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={onCancel}>
                    {t("common.cancel")}
                </Button>
                <Button type="button" onClick={submit} disabled={saving || infoQuery.isLoading}>
                    {saving ? t("common.loading") : t("common.save")}
                </Button>
            </div>
        </div>
    );
}
