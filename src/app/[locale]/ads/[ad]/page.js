import { fetchPublicSingleAd } from "@/lib/fetchPublicSingleAd";
import AdDetail from "@/components/ad-page/ad-detail";
import AdProfile from "@/components/ad-page/ad-profile";

export default async function AdDetailPage({ params }) {
    const { ad } = await fetchPublicSingleAd(params.ad);
    return <section className="ad-detail">
        <div className="grid grid-cols-12 gap-6">
            <div className="bg-base-200 p-5  rounded-box shadow-sm col-span-12 lg:col-span-8 flex flex-col">
                <AdDetail data={ad} />
            </div>
            <div className="col-span-12 lg:col-span-4">
                {/* <AdProfile profileData={ad.profiles} /> */}
                <AdProfile/>
            </div>

        </div>
    </section>

}
