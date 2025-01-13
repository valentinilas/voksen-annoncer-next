import { fetchPublicAds } from "@/lib/fetchPublicAds";
import AdListingResult from "@/components/ad-listing/ad-listing-result";
// import Filters from "@/components/filters/filters";
import { Link } from "@/i18n/routing";
import { getTranslations } from "next-intl/server";
import { generateAlternatesBlock } from "@/utils/generate-canonical/generateAlternatesBlock";


export async function generateMetadata({params, searchParams}) {
    const { locale, query } = await params;
    const t = await getTranslations();

    return {
        title: `${t("search-results.result-title", { term: decodeURIComponent(query) })}`,
        description: `${t("search-results.result-description", { term: decodeURIComponent(query) })}`,
        alternates: {
            canonical: `https://www.voksen-annoncer.com/${locale}/search/${query}`,
            languages: {
                'en': `https://www.voksen-annoncer.com/en/search/${query}`,
                'da': `https://www.voksen-annoncer.com/da/search/${query}`,
                'x-default': `https://www.voksen-annoncer.com/da/search/${query}`
            },
        },
         alternates: generateAlternatesBlock(locale, `/search/${query}`, await searchParams)
    };
}

export default async function SearchPage(props) {
    const searchParams = await props.searchParams;
    const params = await props.params;

    const searchTerm = params.query;
    const t = await getTranslations();
    const pageSize = 10;
    const { page = 1 } = searchParams;
    // const { ads, total } = await fetchPublicAds(null, null, null, searchTerm, page, pageSize);

    // Fetch ads from the new API endpoint
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/get-public-posts?search=${searchTerm}&page=${page}&pageSize=${pageSize}`, {
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
        <h1 className="text-3xl mb-5">{t("search-results.result-headline", { term: decodeURIComponent(searchTerm) })}</h1>

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

