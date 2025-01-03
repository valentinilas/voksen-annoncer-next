
import Posts from "@/components/dashboard/posts";
import { DashboardProfile } from "@/components/dashboard/profile";

import { fetchCurrentUser } from "@/lib/fetchCurrentUser";
import { fetchUserProfile } from "@/lib/fetchUserProfile";
// import { fetchRegions } from "@/lib/fetchRegions";
import { fetchGenders } from "@/lib/fetchGenders";

import { getTranslations } from 'next-intl/server';

import { apiFetchRegions } from "@/utils/api/fetch-helpers";

export async function generateMetadata({ params, searchParams }, parent) {
    const t = await getTranslations();
    const { locale } = await params;
    return {
        title: `${t("navigation.profile")} | ${t("navigation.site-name")}`,
        alternates: {
            canonical: `https://www.voksen-annoncer.com/${locale}/dashboard`,
            languages: {
                'en': `https://www.voksen-annoncer.com/en/dashboard`,
                'da': `https://www.voksen-annoncer.com/da/dashboard`
            },
        },
    };

}

export default async function Dashboard() {

    const userData = await fetchCurrentUser();
    const profile = await fetchUserProfile(userData?.user?.id);
    if (!profile) {
        return <span>Could not load profile</span>
    }


    const { regions } = await apiFetchRegions();

    const { genders } = await fetchGenders()


    return <>

        <section className="dashboard">
            <div className="grid grid-cols-12 gap-6">
                <div className="col-span-12 lg:col-span-4 ">
                    <div className="h-full">
                        <DashboardProfile currentUser={userData} profile={profile?.userProfile} regions={regions} genders={genders} />
                    </div>

                </div>
                <div className="col-span-12 lg:col-span-8">
                    <Posts />
                </div>
            </div>
        </section>
    </>
}