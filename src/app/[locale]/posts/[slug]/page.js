


import { fetchPublicSingleAd } from "@/lib/fetchPublicSingleAd";
import { fetchCurrentUser } from "@/lib/fetchCurrentUser";

import AdDetail from "@/components/ad-page/ad-detail";
import AdProfile from "@/components/ad-page/ad-profile";
import { fetchUserProfile } from "@/lib/fetchUserProfile";
import { getTranslations } from "next-intl/server";

import ViewIncrementer from "@/components/view-incrementer/view-incrementer";

import { fetchComments } from "@/lib/comments";

import CommentList from "@/components/ad-page/ad-comment-list";


export async function generateMetadata({ params, searchParams }, parent) {

    try {
        const { ad } = await fetchPublicSingleAd(params.slug);

        return {
            title: ad.title + ' | Voksenannoncer',
            description: ad.description,
            openGraph: {
                images: [ad.ad_images[0]?.image_url || ''],
            },

        };
    } catch (error) {
        console.error("Failed to fetch ad data:", error);
        return {
            title: "Gratis Voksenannoncer | Post Dine Annoncer på Vores Platform",
            description: "Udforsk og opret gratis voksenannoncer på vores  platform. Nem, hurtig og sikker måde at dele dine annoncer på. Start i dag og nå ud til flere!",
        };
    }
}

export default async function AdDetailPage({ params }) {


    const t = await getTranslations();
    const [adData, userData] = await Promise.all([
        fetchPublicSingleAd(params.slug),
        fetchCurrentUser()
    ]);
    const { userProfile: profile } = await fetchUserProfile(userData?.user?.id);

    const { ad } = adData;
    const { user } = userData;
    const { is_admin } = profile?.userProfile || {};
    const { uuid } = ad;

    const { data: comments } = await fetchComments(uuid);



    if (!is_admin && !ad.is_approved) {
        return <>

            <section>
                <div className="grid grid-cols-12 gap-6">
                    <div className="bg-base-100 p-20 text-center  rounded-box shadow-sm col-span-12 lg:col-span-8 flex flex-col">
                        <p text-center>{t("ads.not-approved")}</p>
                    </div>
                    <div className="col-span-12 lg:col-span-4">
                        <AdProfile profileData={ad.profiles} currentSessionUser={user} />
                    </div>

                </div>
            </section>
        </>
    }

    return <>
        <section>

            <ViewIncrementer slug={params.slug} />
            <div className="grid grid-cols-12 gap-6">
                <div className="bg-base-100 p-5  rounded-box shadow-sm col-span-12 lg:col-span-8 flex flex-col">
                    <AdDetail data={ad} slug={params.slug} />
                </div>
                <div className="col-span-12 lg:col-span-4">
                    <AdProfile profileData={ad.profiles} currentSessionUser={user} />
                </div>
                <div className="col-span-12 lg:col-span-8">
                    <CommentList initialComments={comments} ad={ad} adId={uuid} user={profile} />
                </div>
            </div>
        </section>
    </>


}
