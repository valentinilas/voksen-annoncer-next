import Button from "@/components/button/button";
import { generateAlternatesBlock } from "@/utils/generate-canonical/generateAlternatesBlock";

import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";

export async function generateMetadata({ params, searchParams }, parent) {
    const t = await getTranslations();
    const { locale } = await params

    return {
        title: `${t("auth.email-confirmed-headline")} | ${t("navigation.site-name")}`,
        description: t('auth.email-confirmed-body2'),
        alternates: generateAlternatesBlock(locale, '/email-confirmation', await searchParams)
    };

}

export default function EmailConfirmation() {
    const t = useTranslations();

    return (
        <div className="container mx-auto bg-base-100  p-5 rounded-box  sm:max-w-sm">
            <div className="sm:mx-auto sm:w-full sm:max-w-sm flex flex-col items-start">
                <h1 className="text-2xl font-bold mb-4 text-center">{t("auth.email-confirmed-headline")}</h1>
                <p className="mb-10">{t("auth.email-confirmed-body1")}</p>
                <p className="mb-10">{t("auth.email-confirmed-body2")}</p>
                <Button variant="primary" className="" to="/dashboard">{t("navigation.profile")}</Button>
            </div>
        </div>
    );
};


