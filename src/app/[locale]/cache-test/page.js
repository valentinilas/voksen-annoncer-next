// import { useTranslations } from "next-intl";
// import { getTranslations } from 'next-intl/server';
import { routing } from '@/i18n/routing';
// import { setRequestLocale } from "next-intl/server";


export function generateStaticParams() {
    return [{ locale: 'en' }, { locale: 'da' }];
}

export const revalidate = 3600;
export default function CacheTest() {


    return (
        <section className="cache-test">
            <h1>This page should be static!</h1>
        </section>
    );
}