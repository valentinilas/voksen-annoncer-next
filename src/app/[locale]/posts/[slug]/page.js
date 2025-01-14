


// import { fetchPublicSingleAd } from "@/lib/fetchPublicSingleAd";
import { apiFetchSinglePost } from "@/utils/api/fetch-helpers";
import { fetchCurrentUser } from "@/lib/fetchCurrentUser";

import AdDetail from "@/components/ad-page/ad-detail";
import AdProfile from "@/components/ad-page/ad-profile";
import { fetchUserProfile } from "@/lib/fetchUserProfile";
import { getTranslations } from "next-intl/server";

import ViewIncrementer from "@/components/view-incrementer/view-incrementer";

import FeaturedAdsWrapper from "@/components/featured-ads/featured-ads-wrapper";
import { fetchComments } from "@/lib/comments";

import CommentList from "@/components/ad-page/ad-comment-list";
// get-all-public-posts
import { apiFetchAllPublicPosts } from "@/utils/api/fetch-helpers";
import { routing } from '@/i18n/routing';
import { generateAlternatesBlock } from "@/utils/generate-canonical/generateAlternatesBlock";


// // export const dynamic = 'force-static';
// export const revalidate = 3600;
// // This ensures all possible paths are generated at build time
// export async function generateStaticParams() {
//     try {
//         const { ads } = await apiFetchAllPublicPosts();
//         console.log('Fetched All Posts');
//         // Generate paths for each article in each locale
//         const paths = routing.locales.flatMap(locale =>
//             ads.map(ad => ({
//                 locale,
//                 slug: ad.slug
//             }))
//         );
//         console.log(paths);


//         return paths;
//     } catch (error) {
//         console.error('Error generating static params:', error);
//         return [];
//     }
// }

export async function generateMetadata({ params, searchParams }) {

    const { slug, locale } = await params

    try {


        const { ad } = await apiFetchSinglePost(slug);

        return {
            title: ad.title + ' | Voksenannoncer',
            description: ad.description.slice(0, 150),
           
            alternates: generateAlternatesBlock(locale, `/posts/${slug}`, await searchParams, true),

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
    const { slug } = await params;


    const t = await getTranslations();

    // Use Promise.all to fetch data in parallel
    const [adData, userData] = await Promise.all([
        apiFetchSinglePost(slug),
        fetchCurrentUser()
    ]);
    const { userProfile: profile } = await fetchUserProfile(userData?.user?.id);
    const { ad } = adData;

    const { user } = userData;
    const { is_admin } = profile || {};
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

            <ViewIncrementer slug={slug} />
            <div className="grid grid-cols-12 gap-6">
                <div className="bg-base-100 p-5  rounded-box shadow-sm col-span-12 lg:col-span-8 flex flex-col">
                    <AdDetail data={ad} slug={slug} />
                    <div className="mt-10"><CommentList initialComments={comments} ad={ad} adId={uuid} user={profile} /></div>
                </div>
                <div className="col-span-12 lg:col-span-4">
                    <AdProfile profileData={ad.profiles} currentSessionUser={user} />
                    <div className="mt-10"><FeaturedAdsWrapper vertical="true" /></div>

                </div>

            </div>
        </section>
    </>
}
