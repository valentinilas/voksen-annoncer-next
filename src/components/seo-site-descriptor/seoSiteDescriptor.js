import { useTranslations } from "next-intl";

export default function SeoSiteDescriptor() {
    const t = useTranslations("seo-descriptor");
    return <div className="bg-base-200 p-10 mb-5 mt-10 rounded-box shadow-xl">
        <p className="mb-4">{t("p1")}</p>
        <p className="mb-4">{t("p2")}</p>
        <p className="mb-4">{t("p3")}</p>
        <p className="mb-4">
            {t.rich("p4", {
                emailLink: (chunks) => (<a className="link" href="mailto:support@voksen-annoncer.com">{chunks}</a>
                )
            })}
        </p>
        <p className="mb-4">{t("p5")}</p>
        <p className="mb-4">{t("p6")}</p>
        <p className="mb-4">{t("p7")}</p>
    </div>;
}

