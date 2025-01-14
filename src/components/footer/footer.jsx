// import { useTranslation } from "react-i18next";
'use client';

import Image from "next/image";
import { Link } from "@/i18n/routing";

// import { useRouter, usePathname } from 'next/navigation';
import { useTheme } from "@/lib/themeContextProvider";
import { useTranslations } from "next-intl";

import {useParams} from 'next/navigation';
import {usePathname, useRouter} from '@/i18n/routing';




export default function Footer({locale}) {
    const t = useTranslations();
    const { toggleTheme } = useTheme();
    const router = useRouter();
    const pathname = usePathname();
    const params = useParams();

    const handleLanguageChange = (nextLocale) => {
        router.replace(
            {pathname, params},
            {locale: nextLocale}
          );
    };
    

    const year = new Date().getFullYear();
    return (

        <>
            <footer className="footer bg-base-100 text-base-content p-10 rounded-t-2xl">
                <aside >
                    <Image className="w-10 md:w-16 mb-4" src='/logo/va-logo-cherry.svg' alt="Voksenannoncer" width="64" height="64" />
                    <p className="text-center">&copy; {year} Voksenannoncer.</p>
                </aside>
                <nav>
                    {/* <h6 className="footer-title">Account</h6> */}

                    <Link className="link link-hover" href="/sign-in">{t("navigation.log-in")}</Link>
                    <Link className="link link-hover" href="/sign-up">{t("navigation.sign-up")}</Link>

                </nav>
                <nav>
                    {/* <h6 className="footer-title">Company</h6> */}
                    <Link className="link link-hover" href="/">{t("navigation.ads")}</Link>
                    <Link className="link link-hover" href="/articles">{t("navigation.articles")}</Link>
                    <Link href="/about">{t("navigation.about")}</Link>
                    <Link href="/support">{t("navigation.support")}</Link>
                    <Link href="/cookie-policy">{t("navigation.cookie-policy")}</Link>
                </nav>
                <nav className="col-span-4">
                    {/* <h6 className="footer-title">Language</h6> */}
                    <button className="link link-hover inline-flex gap-2" onClick={() => handleLanguageChange('da')}><Image className="size-5" src="/flags/denmark.svg" alt="Danish flag" width="20" height="20" />Dansk</button>
                    <button className="link link-hover inline-flex gap-2" onClick={() => handleLanguageChange('en')}><Image className="size-5" src="/flags/great-britain.svg" alt="English flag" width="20" height="20" />English</button>
                </nav>

            </footer>
            <footer className="footer border-t-2 border-base-200 footer-center bg-base-100 text-base-content p-10 rounded-b-2xl">
                <aside>
                    <aside className="col-span-4">{t('footer.disclaimer')}</aside>
                </aside>
            </footer>
        </>
    );
}