import Button from "@/components/button/button";

import { useTranslations } from "next-intl";
export default function EmailConfirmation() {
    const t = useTranslations();

    return (
        <div className="container mx-auto bg-base-200  p-5 rounded-box  sm:max-w-sm">
            <div className="sm:mx-auto sm:w-full sm:max-w-sm flex flex-col items-start">
                <h2 className="text-2xl font-bold mb-4 text-center">{t("auth.email-confirmed-headline")}</h2>
                <p className="mb-10">{t("auth.email-confirmed-body1")}</p>
                <p className="mb-10">{t("auth.email-confirmed-body2")}</p>
                <Button variant="primary" className="" to="/dashboard">{t("navigation.profile")}</Button>
            </div>
        </div>
    );
};


