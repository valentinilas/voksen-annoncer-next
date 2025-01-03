// import { useTranslations } from "next-intl";
// import { getTranslations } from 'next-intl/server';
import { routing } from '@/i18n/routing';
// import { setRequestLocale } from "next-intl/server";


export function generateStaticParams() {
    return routing.locales.map((locale) => ({ locale }));
}




// export async function generateMetadata(props) {
//     const params = await props.params;
//     const locale = params.locale;

//     setRequestLocale(locale);
//     const t = await getTranslations('');
//     return {
//         title: `${t("navigation.cookie-policy")} | ${t("navigation.site-name")}`,
//         alternates: {
//             canonical: `https://www.voksen-annoncer.com/${locale}/cookie-policy`,
//             languages: {
//                 'en': `https://www.voksen-annoncer.com/en/cookie-policy`,
//                 'da': `https://www.voksen-annoncer.com/da/cookie-policy`
//             },
//         },
//     };

// }
export default function CacheTest() {


    return (
        <section className="cache-test">
            <h1>This page should be static!</h1>
        </section>
    );
}