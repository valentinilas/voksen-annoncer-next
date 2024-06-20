// import Button from "../button/button";
// import { PlusIcon, UserIcon, Cog6ToothIcon, ArrowLeftStartOnRectangleIcon, ArrowLeftEndOnRectangleIcon } from "@heroicons/react/24/outline";
// import { useNavigate } from "react-router-dom";
// import logo from '../../assets/va-logo-cherry.svg';
// import { NavLink } from "react-router-dom";
// import { cdnUrl } from "../../util/cdn-url";
// import Label from "../label/label";

'use client';

import { PlusIcon, UserIcon, Cog6ToothIcon, ArrowLeftStartOnRectangleIcon, ArrowLeftEndOnRectangleIcon } from "@heroicons/react/24/outline";
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

    console.log('userProfile', userProfile);

    const isLoggedIn = user !== null

    console.log('isLoggedIn', isLoggedIn)


    // const { profile, loading: loadingProfile, error: errorProfile } = profileData;
    const { avatar_url, username, is_admin } = userProfile || {};


    // const navigate = useNavigate();

    // const handleLogOut = async () => {
    //     try {
    //         await auth_user_log_out();
    //         navigate('/dashboard');
    //     } catch (error) {
    //         setError(error.message);
    //     }
    // }

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
        <div className="navbar bg-base-200 rounded-box px-5 shadow-sm">
            <div className="navbar-start">
                <Link href="/" className="flex gap-4 items-center">
                    <Image className="w-10 md:w-16" src='/logo/va-logo-cherry.svg' alt="Voksen Annoncer" width="64" height="64" />
                    <span className="font-bold text-xl hidden md:block">Voksen Annoncer</span>
                </Link>
            </div>


            {!isLoggedIn &&

                <div className="navbar-end ">
                    <ul className="menu menu-horizontal px-1 gap-2">
                        <li><Button variant="primary" Icon={ArrowLeftEndOnRectangleIcon} to="/sign-in" className="hidden md:inline-flex">Log in</Button></li>
                        <li>
                            <label htmlFor="my-drawer" aria-label="open sidebar" className="btn btn-circle btn-ghost">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-6 h-6 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>

                            </label>
                        </li>
                    </ul>
                </div>
            }
            {isLoggedIn &&
                <div className="navbar-end gap-4">

                    {username && <Link className="link link-hover text-sm font-bold hidden md:block" href="/dashboard">{username}</Link>}
                    <div className="dropdown dropdown-end">

                        <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar ">

                            {avatar_url ? (
                                <img
                                    className="rounded-full  w-8 h-8"
                                    src={cdnUrl(avatar_url, 300, 300)}
                                    alt={`Avatar ${username ?? username}`}
                                />
                            ) : (
                                <UserIcon className="w-8 h-8" />
                            )}
                        </div>
                        <ul tabIndex={0} className="menu menu-sm dropdown-content mt-0 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
                            {is_admin && <li>
                                <Link href="/admin"><Cog6ToothIcon className="size-5" /> {t("navigation.admin")}</Link>
                            </li>
                            }
                            <li>
                                <Link href="/create-ad"><PlusIcon className="size-5" /> {t("navigation.create-ad")}</Link>
                            </li>
                            <li>
                                <Link href="/dashboard"><UserIcon className="size-5" /> {t("navigation.profile")}</Link>
                            </li>
                            <li><button onClick={handleLogout}><ArrowLeftStartOnRectangleIcon className="size-5" /> {t("navigation.log-out")}</button></li>
                        </ul>
                    </div>
                    <ul className="menu menu-horizontal px-1 gap-2">
                        <li>
                            <label htmlFor="my-drawer" aria-label="open sidebar" className="btn btn-circle btn-ghost">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-6 h-6 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
                            </label>
                        </li>
                    </ul>

                </div>
            }
        </div>
    );
}

