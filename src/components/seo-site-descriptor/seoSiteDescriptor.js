import { useTranslations } from "next-intl";
import Link from "next/link";

export default function SeoSiteDescriptor() {
    const t = useTranslations("seo-descriptor");
    return <div className="bg-base-100 p-10 mb-5 mt-10 rounded-box shadow-xl">
        <p className="mb-4">{t.rich("p1", {
            searchLink: (chunks) => (
                <Link className="link" href={t(`linkUrls.${chunks}`) || `/search/${chunks}`}>
                    {chunks}
                </Link>
            )
        })}</p>
        <p className="mb-4">
            {t.rich("p2", {
                searchLink: (chunks) => (
                    <Link className="link" href={t(`linkUrls.${chunks}`) || `/search/${chunks}`}>
                        {chunks}
                    </Link>
                )
            })}
        </p>
        <p className="mb-4">{t.rich("p3", {
            searchLink: (chunks) => (
                <Link className="link" href={t(`linkUrls.${chunks}`) || `/search/${chunks}`}>
                    {chunks}
                </Link>
            )
        })}</p>
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

