import Link from "next/link";
import { useTranslations } from "next-intl";

import { getTranslations } from 'next-intl/server';
import { generateAlternatesBlock } from "@/utils/generate-canonical/generateAlternatesBlock";

export async function generateMetadata({ params, searchParams }, parent) {
    const t = await getTranslations();
    const { locale } = await params

    return {
        title: `${t("navigation.support")} | ${t("navigation.site-name")}`,
        alternates: generateAlternatesBlock(locale, '/support', await searchParams)
    };

}

export default function Support() {
    const t = useTranslations();

    return (
        <section className="support">
            <div className="bg-base-100 p-20 rounded-box shadow-sm">
                <h1 className="text-4xl mb-5">{t('support.title')}</h1>
                <p className="mb-3">{t('support.contactEmail')} <a className="link" href={`mailto:${t('support.emailAddress')}`}>{t('support.emailAddress')}</a></p>

                <h2 className="text-2xl mb-5 mt-5">{t('support.cookiePolicy.title')}</h2>
                <p className="mb-3">{t('support.cookiePolicy.description')} <Link className="link" href={t('support.cookiePolicy.policyLink')}>{t('support.cookiePolicy.linkText')}</Link></p>
            </div>



        </section>
    );
}