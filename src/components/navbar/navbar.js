// import Button from "../button/button";
// import { PlusIcon, UserIcon, Cog6ToothIcon, ArrowLeftStartOnRectangleIcon, ArrowLeftEndOnRectangleIcon } from "@heroicons/react/24/outline";
// import { useNavigate } from "react-router-dom";
// import logo from '../../assets/va-logo-cherry.svg';
// import { NavLink } from "react-router-dom";
// import { cdnUrl } from "../../util/cdn-url";
// import Label from "../label/label";

'use client';

import { PlusIcon, UserIcon, Cog6ToothIcon, ArrowLeftStartOnRectangleIcon, ArrowLeftEndOnRectangleIcon, UserPlusIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import Button from '../button/button';
import Label from "../label/label";
import { cdnUrl } from "@/utils/imagekit/cdn-url";
import { useTranslations } from 'next-intl';
import Image from "next/image";
import { useUser } from "@/lib/userContextProvider";

// import { useAuth } from "../../lib/auth-context";


export default function NavBar() {

    const t = useTranslations();
    const { user, userProfile } = useUser();
    const isLoggedIn = user !== null



    // const { profile, loading: loadingProfile, error: errorProfile } = profileData;
    const { avatar_url, username, is_admin } = userProfile || {};




    async function handleLogout() {
        try {
            const response = await fetch('/auth/logout', {
                method: 'POST',
            });
            if (response.ok) {
                // Redirect or update UI as needed
                window.location.href = '/sign-in';
            }
        } catch (error) {
            console.error('Logout failed:', error);
        }
    }

    return (
        <div className="navbar bg-base-100 rounded-box px-5 shadow-sm">
            <div className="flex-1">
                <Link href="/" className="flex gap-4 items-center">
                    <Image className="w-10 md:w-16" src='/logo/va-logo-cherry.svg' alt="Voksenannoncer logo" width="64" height="64" />
                    <span className="font-bold text-xl hidden md:block">Voksenannoncer</span>
                </Link>
            </div>


            {!isLoggedIn &&

                <div className="flex-none">
                    <ul className="menu menu-horizontal items-center px-1 gap-2">
                        <li><Button size="m" variant="primary" Icon={UserPlusIcon} to="/sign-up" className="hidden md:inline-flex">{t('navigation.sign-up')}</Button></li>
                        <li><Button size="m" variant="secondary" Icon={ArrowLeftEndOnRectangleIcon} to="/sign-in" className="hidden md:inline-flex">{t('navigation.log-in')}</Button></li>

                        <li>
                            <label htmlFor="my-drawer" aria-label="Open sidebar" role="button" tabIndex="0" className="btn btn-circle btn-ghost">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-6 h-6 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>

                            </label>
                        </li>
                    </ul>
                </div>
            }
            {isLoggedIn &&
                <div className="flex-none gap-2">

                    {username && <Link className="link link-hover text-sm font-bold hidden md:block" href="/dashboard">{username}</Link>}
                    <div className="dropdown dropdown-end">

                        <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar ">

                            {avatar_url ? (
                    
                                <Image  src={cdnUrl(avatar_url, 300, 300)}  alt={`Avatar ${username ?? username}`} width={32} height={32} className="rounded-full  w-8 h-8"/>
                            ) : (
                                <UserIcon className="size-5" />
                            )}
                        </div>
                        <ul tabIndex={0} className="menu menu-sm dropdown-content mt-0 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
                            {is_admin && <li>
                                <Link href="/admin"><Cog6ToothIcon className="size-5" /> {t("navigation.admin")}</Link>
                            </li>
                            }
                            <li>
                                <Link href="/new-post"><PlusIcon className="size-5" /> {t("navigation.create-ad")}</Link>
                            </li>
                            <li>
                                <Link href="/dashboard"><UserIcon className="size-5" /> {t("navigation.profile")}</Link>
                            </li>
                            <li><button onClick={handleLogout}><ArrowLeftStartOnRectangleIcon className="size-5" /> {t("navigation.log-out")}</button></li>
                        </ul>
                    </div>
                    <ul className="menu menu-horizontal px-1 gap-2">
                        <li>
                            <label htmlFor="my-drawer" aria-label="Open sidebar" role="button" tabindex="0" className="btn btn-circle btn-ghost">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-6 h-6 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
                            </label>
                        </li>
                    </ul>

                </div>
            }
        </div>
    );
}

