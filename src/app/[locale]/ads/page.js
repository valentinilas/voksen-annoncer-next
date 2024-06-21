import { fetchPublicAds } from "@/lib/fetchPublicAds";
import { fetchCategories } from "@/lib/fetchCategories";
import { fetchRegions } from "@/lib/fetchRegions";
import AdListingResult from "@/components/ad-listing/ad-listing-result";
import Filters from "@/components/filters/filters";
import { calculateAge } from "@/utils/calculate-age/calculate-age";

export default async function Ads({ searchParams }) {
    const { category, subcategory, region, search } = searchParams;

    const { ads, total } = await fetchPublicAds(category, subcategory, region, search);
    const { categories } = await fetchCategories();
    const { regions } = await fetchRegions();
    return <>
        <Filters categories={categories} regions={regions} />
        {ads.map(ad => {
            return <AdListingResult key={ad.uuid} data={ad} />
        })}
    </>
}