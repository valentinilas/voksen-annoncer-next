


import { fetchPublicSingleAd } from "@/lib/fetchPublicSingleAd";
import { fetchCurrentUser } from "@/lib/fetchCurrentUser";

import AdDetail from "@/components/ad-page/ad-detail";
import AdProfile from "@/components/ad-page/ad-profile";


export async function generateMetadata({ params, searchParams }, parent) {

    try {
        const {ad} = await fetchPublicSingleAd(params.postId);

        return {
            title: ad.title,
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

    const [adData, userData] = await Promise.all([
        fetchPublicSingleAd(params.postId),
        fetchCurrentUser()
    ]);

    const { ad } = adData;
    const { user } = userData;

    return <>
        <section className="ad-detail">
            <div className="grid grid-cols-12 gap-6">
                <div className="bg-base-200 p-5  rounded-box shadow-sm col-span-12 lg:col-span-8 flex flex-col">
                    <AdDetail data={ad} />
                </div>
                <div className="col-span-12 lg:col-span-4">
                    <AdProfile profileData={ad.profiles} currentSessionUser={user} />
                </div>

            </div>
        </section>
    </>


}
