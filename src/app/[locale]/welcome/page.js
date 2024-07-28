import Button from "@/components/button/button";

import { useTranslations } from "next-intl";
export default function Welcome() {
    const t = useTranslations();

    return (
        <div className="container mx-auto bg-base-100  p-5 rounded-box  sm:max-w-sm">
            <div className="sm:mx-auto sm:w-full sm:max-w-sm flex flex-col items-start">
                <h1 className="text-2xl font-bold mb-4 text-center">{t("welcome.headline")}</h1>
                <p className="mb-10">{t("welcome.body")}</p>
                <Button variant="primary" className="" to="/">{t("welcome.homepage")}</Button>
            </div>
        </div>
    );
};


