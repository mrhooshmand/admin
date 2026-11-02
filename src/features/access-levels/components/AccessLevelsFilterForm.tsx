import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useLocale } from "@/app/providers/LocaleProvider";
import { Button } from "@/shared/ui/button";
import { Field, FieldLabel } from "@/shared/ui/field";
import { Input } from "@/shared/ui/input";
import { FormGrid } from "@/shared/components/layout/FormGrid";
import { accessLevelFilterSchema } from "@/features/access-levels/schemas";
import { AccessLevelFilters } from "@/features/access-levels/types/filters";
import { INITIAL_ACCESS_LEVEL_FILTERS } from "@/features/access-levels/constants";

interface AccessLevelsFilterFormProps {
    onSubmit: (values: AccessLevelFilters) => void;
}

const selectClass =
    "h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50";

export function AccessLevelsFilterForm({ onSubmit }: AccessLevelsFilterFormProps) {
    const { t } = useLocale();
    const { register, handleSubmit } = useForm<z.infer<typeof accessLevelFilterSchema>>({
        resolver: zodResolver(accessLevelFilterSchema),
        defaultValues: INITIAL_ACCESS_LEVEL_FILTERS,
    });

    return (
        <form id="access-levels-filter-form" onSubmit={handleSubmit(onSubmit)}>
            <FormGrid>
                <Field>
                    <FieldLabel>{t("accessLevels.role")}</FieldLabel>
                    <Input {...register("title")} />
                </Field>
                <Field>
                    <FieldLabel>{t("accessLevels.status")}</FieldLabel>
                    <select className={selectClass} {...register("status")}>
                        <option value="-1">{t("accessLevels.all")}</option>
                        <option value="1">{t("accessLevels.active")}</option>
                        <option value="0">{t("accessLevels.inactive")}</option>
                    </select>
                </Field>
                <div className="flex items-center justify-start">
                    <Button type="submit">{t("common.search")}</Button>
                </div>
            </FormGrid>
        </form>
    );
}
