import { fetchPublicAds } from "@/lib/fetchPublicAds";
import AdListingResult from "@/components/ad-listing/ad-listing-result";
// import Filters from "@/components/filters/filters";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { apiFetchRegions } from "@/utils/api/fetch-helpers";

export async function generateMetadata(props, parent) {
    const params = await props.params;
    const { locale } = params
    const t = await getTranslations();
    const { regions } = await apiFetchRegions();
    const searchRegion = regions.find((region) => region.slug === params.query);

    return {
        title: `${t("location-results.location-title", { term: decodeURIComponent(searchRegion?.region_name) })}`,
        alternates: {
            canonical: `https://www.voksen-annoncer.com/${locale}/location/${params.query}`,
            languages: {
                'en': `https://www.voksen-annoncer.com/en/location/${params.query}`,
                'da': `https://www.voksen-annoncer.com/da/location/${params.query}`,
                'x-default': `https://www.voksen-annoncer.com/da/location/${params.query}`
            },
        },
    };
}

export default async function RegionPage(props) {
    const searchParams = await props.searchParams;
    const params = await props.params;

    const { regions } = await apiFetchRegions();

    const searchRegion = regions.find((region) => region.slug === params.query);


    const t = await getTranslations();
    if (!searchRegion) {
        return <>
            <p className="text-center">{t("ads.no-results")}</p>
        </>
    }

    const pageSize = 10;
    const { page = 1 } = searchParams;
    // const { ads, total } = await fetchPublicAds(null, null, searchRegion?.id, null, page, pageSize);
    // Fetch ads from the new API endpoint
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/get-public-posts?region=${searchRegion.id}&page=${page}&pageSize=${pageSize}`, {
        next: { tags: ['public-posts'] }
    });

    if (!res.ok) {
        throw new Error(`Failed to fetch ads: ${res.status}`);
    }

    const { ads, total } = await res.json();


    const totalPages = Math.ceil(total / pageSize);

    const buildUrl = (newPage) => {
        const params = new URLSearchParams(searchParams);
        params.set('page', newPage.toString());
        return `?${params.toString()}`;
    };

    return <>

        {/* <IntroBanner /> */}
        {/* <Filters key={JSON.stringify(searchParams)} categories={categories} regions={regions} /> */}
        <h1 className="text-3xl mb-5">{t("location-results.location-headline", { term: decodeURIComponent(searchRegion?.region_name) })}</h1>

        {ads.map(ad => {
            return <AdListingResult key={ad.uuid} data={ad} />
        })}

        {!ads.length && <div className="bg-base-100 p-5 my-2 rounded-box shadow-sm"><p className="text-center">{t('ads.no-results')}</p></div>}

        {/* Pagination Controls */}

        {totalPages > 1 && (<div className="flex justify-center">
            <div className="join mx-auto mt-2">
                <Link
                    className={`join-item btn ${page <= 1 ? 'btn-disabled' : ''}`}
                    href={buildUrl(Math.max(1, parseInt(page) - 1))}
                >
                    «
                </Link>
                <button className="join-item btn">
                    {t("pagination.Page")} {page} {t("pagination.of")} {totalPages}
                </button>
                <Link
                    className={`join-item btn ${page >= totalPages ? 'btn-disabled' : ''}`}
                    href={buildUrl(Math.min(totalPages, parseInt(page) + 1))}
                >
                    »
                </Link>
            </div>
        </div>
        )}

    </>
}

