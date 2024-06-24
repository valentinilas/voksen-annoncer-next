
import Posts from "@/components/dashboard/posts";
import { DashboardProfile } from "@/components/dashboard/profile";

import { fetchCurrentUser } from "@/lib/fetchCurrentUser";
import { fetchUserProfile } from "@/lib/fetchUserProfile";
import { fetchRegions } from "@/lib/fetchRegions";
import { fetchGenders } from "@/lib/fetchGenders";

export default async function Dashboard() {

    const userData = await fetchCurrentUser();
    const profile = await fetchUserProfile(userData?.user?.id);
    if (!profile) {
        return <span>Could not load profile</span>
    }

    const {regions} = await fetchRegions();
    const {genders} = await fetchGenders()


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