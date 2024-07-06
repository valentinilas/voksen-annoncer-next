'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { fetchCurrentUser } from "@/lib/fetchCurrentUser";
import { fetchUserProfile } from "@/lib/fetchUserProfile";

export function AdminWrapper({ children }) {
    const [isLoading, setIsLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);
    const router = useRouter();

    useEffect(() => {
        async function checkAdminStatus() {
            try {
                const userData = await fetchCurrentUser();
                if (!userData?.user?.id) {
                    router.push('/sign-in');
                    return;
                }

                const profile = await fetchUserProfile(userData.user.id);
                const { is_admin } = profile?.userProfile || {};

                if (!is_admin) {
                    router.push('/'); // Redirect to home page or unauthorized page
                } else {
                    setIsAdmin(true);
                }
            } catch (error) {
                console.error("Error checking admin status:", error);
                router.push('/sign-in');
            } finally {
                setIsLoading(false);
            }
        }

        checkAdminStatus();
    }, [router]);

    if (isLoading) {
        return <div className="bg-base-100 p-10 my-2 rounded-box shadow-sm text-center"><span className="loading loading-spinner loading-sm"></span></div>;
    }

    if (!isAdmin) {
        return null;
    }

    return <>{children}</>;
}