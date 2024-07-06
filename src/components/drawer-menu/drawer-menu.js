'use client';
import { useTranslations } from "next-intl"
import Link from "next/link";
import Image from "next/image";
import { useUser } from "@/lib/userContextProvider";
import { PlusIcon, UserIcon, Cog6ToothIcon, ArrowLeftStartOnRectangleIcon } from "@heroicons/react/24/outline";
import { handleLogout } from "@/lib/handle-log-out";
import { useRouter, usePathname } from 'next/navigation';
import { useTheme } from "@/lib/themeContextProvider";
import { setCookie } from 'cookies-next';






export function DrawerMenu() {
    const t = useTranslations();
    const { toggleTheme } = useTheme()


    const { user, userProfile } = useUser();
    const isLoggedIn = user !== null
    const { is_admin } = userProfile || {};

    const router = useRouter();
    const pathname = usePathname();

    const handleLanguageChange = (locale) => {


        const currentPathname = pathname;

        // Remove the current locale from the pathname if it exists
        const pathnameWithoutLocale = currentPathname.replace(/^\/[a-z]{2}/, '');

        // Construct the new path with the selected locale
        const newPath = `/${locale}${pathnameWithoutLocale}`;

        // router.push(newPath);
        router.push(newPath, undefined, { locale });
        router.refresh(); // clear caching to make sure the locale cookie is set correctly
    };


    return <ul className="menu p-4 w-80 min-h-full bg-base-100 text-base-content">
        <li className="w-full p-4 border-b border-b-base-300 font-bold mb-4">{t("navigation.menu")}</li>
        {/* Logged in */}
        {isLoggedIn &&
            <>
                {is_admin && <li><Link href="/admin"> <Cog6ToothIcon className="size-5" />{t("navigation.admin")}</Link></li>}
                <li><Link href="/dashboard"><UserIcon className="size-5" />{t("navigation.profile")}</Link></li>
                <li><Link href="/new-post"><PlusIcon className="size-5" />{t("navigation.create-ad")}</Link></li>
                <li><button onClick={handleLogout}><ArrowLeftStartOnRectangleIcon className="size-5" />{t("navigation.log-out")}</button></li>
                <li className="border-b border-b-base-300 my-4"> </li>

            </>
        }
        {/* Generic */}
        <li><Link href="/">{t("navigation.ads")}</Link></li>
        <li><Link href="/support">{t("navigation.support")}</Link></li>
        <li><Link href="/about">{t("navigation.about")}</Link></li>
        <li><Link href="/cookie-policy">{t("navigation.cookie-policy")}</Link></li>
        <li className="border-b border-b-base-300 my-4"> </li>
        <li><button onClick={() => handleLanguageChange('da')}><Image className="size-5" src="/flags/denmark.svg" alt="Dansk" width="20" height="20" />Dansk</button></li>
        <li><button onClick={() => handleLanguageChange('en')}><Image className="size-5" src="/flags/great-britain.svg" alt="English" width="20" height="20" />English</button></li>


        {/* not logged in */}
        {!isLoggedIn &&
            <>
                <li className="border-b border-b-base-300 my-4"> </li>
                <li>  <Link href="/sign-in">{t("navigation.log-in")}</Link></li>
                <li>  <Link href="/sign-up">{t("navigation.sign-up")}</Link></li>
            </>
        }
        <li className="border-b border-b-base-300 my-4"> </li>
        <li>
            <label className="flex cursor-pointer gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5" /><path d="M12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4" /></svg>
                <input type="checkbox" className="toggle" onChange={toggleTheme} />
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
            </label></li>

    </ul>
}