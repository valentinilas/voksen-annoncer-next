// import { useTranslations } from "next-intl";
// import { getTranslations } from 'next-intl/server';
import { routing } from '@/i18n/routing';
// import { setRequestLocale } from "next-intl/server";


// This ensures all possible paths are generated at build time
export function generateStaticParams() {
    return routing.locales.map((locale) => ({ locale }));
}
// export const dynamic = 'force-static';
export const revalidate = 3600;
export default  function CacheTest({params}) {

    return (
        <section className="cache-test">
            <h1>This page should be static!</h1>
            <p>{params.locale}</p>
       
        </section>
    );
}