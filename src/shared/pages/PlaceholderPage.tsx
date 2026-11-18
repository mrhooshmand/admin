import { useLocale } from "@/app/providers/LocaleProvider";
import type { TranslationKey } from "@/shared/i18n";
import { FileStack } from "lucide-react";

export default function PlaceholderPage({
    titleKey,
}: {
    titleKey: TranslationKey;
}) {
    const { t } = useLocale();

    return (
        <div className="flex flex-1 flex-col gap-4 md:gap-6">
            <div className="px-1">
                <h1 className="text-2xl font-semibold tracking-tight">
                    {t(titleKey)}
                </h1>
                <p className="mt-1 text-sm text-muted-foreground">
                    {t("placeholder.comingSoon")}
                </p>
            </div>

            <div className="flex min-h-[50vh] flex-1 flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border bg-muted/20 px-6 text-center">
                <div className="flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
                    <FileStack className="size-5" />
                </div>
                <p className="max-w-sm text-sm text-muted-foreground">
                    {t("placeholder.emptyHint")}
                </p>
            </div>
        </div>
    );
}
