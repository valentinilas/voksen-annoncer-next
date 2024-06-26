// import { useTranslation } from "react-i18next";
'use client';

import Image from "next/image";
import Link from "next/link";

import { useRouter, usePathname } from 'next/navigation';
import { useTheme } from "@/lib/themeContextProvider";
import { useTranslations } from "next-intl";



export default function Footer() {
    const t = useTranslations();
    const { toggleTheme } = useTheme();
    const router = useRouter();
    const pathname = usePathname();

    const handleLanguageChange = (locale) => {
        const currentPathname = pathname;

        // Remove the current locale from the pathname if it exists
        const pathnameWithoutLocale = currentPathname.replace(/^\/[a-z]{2}/, '');

        // Construct the new path with the selected locale
        const newPath = `/${locale}${pathnameWithoutLocale}`;

        router.push(newPath);
    };

    const year = new Date().getFullYear();
    return (


        <footer className="footer bg-base-200 text-base-content p-10 rounded-box">
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
                <Link href="/about">{t("navigation.about")}</Link>
                <Link href="/support">{t("navigation.support")}</Link>
                <Link href="/cookie-policy">{t("navigation.cookie-policy")}</Link>
            </nav>
            <nav>
                {/* <h6 className="footer-title">Language</h6> */}
                <button className="link link-hover inline-flex gap-2" onClick={() => handleLanguageChange('da')}><Image className="size-5" src="/flags/denmark.svg" alt="Dansk" width="20" height="20" />Dansk</button>
                <button className="link link-hover inline-flex gap-2" onClick={() => handleLanguageChange('en')}><Image className="size-5" src="/flags/great-britain.svg" alt="English" width="20" height="20" />English</button>
            </nav>
        </footer>
    );
}