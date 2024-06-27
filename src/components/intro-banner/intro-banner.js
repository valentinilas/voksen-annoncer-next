import { useTranslations } from "next-intl";
import Button from "../button/button";

export default function IntroBanner(){
    const t = useTranslations("intro-banner");
    return <div className="bg-base-200 p-10 mb-10 rounded-box shadow-sm bg-gradient-to-tr from-cherry-500 to-cherry-700 text-white">
        <h1 className="text-2xl mb-2 ">{t("headline")}</h1>
        <p>{t("body")}</p>
    </div>;
}

