import { fetchPublicAds } from "@/lib/fetchPublicAds";
import { fetchCategories } from "@/lib/fetchCategories";
import { fetchRegions } from "@/lib/fetchRegions";
import AdListingResult from "@/components/ad-listing/ad-listing-result";
import Filters from "@/components/filters/filters";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import IntroBanner from "@/components/intro-banner/intro-banner";
import SeoSiteDescriptor from "@/components/seo-site-descriptor/seoSiteDescriptor";
import Button from "@/components/button/button";
import { PlusIcon } from "@heroicons/react/24/outline";

export default async function Ads({ searchParams }) {
    const t = await getTranslations();
    const pageSize = 10;
    const { category, subcategory, region, search, page = 1 } = searchParams;
    const { categories } = await fetchCategories();
    const { regions } = await fetchRegions();
    const { ads, total } = await fetchPublicAds(category, subcategory, region, search, page, pageSize);


    const totalPages = Math.ceil(total / pageSize);

    const buildUrl = (newPage) => {
        const params = new URLSearchParams(searchParams);
        params.set('page', newPage.toString());
        return `?${params.toString()}`;
    };

    return <>

        {/* <IntroBanner /> */}
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-5">
            <h1 className="text-2xl">{t("navigation.ads")} ({ads.length})</h1>
            <Button Icon={PlusIcon} to="/new-post" className="inline-flex">{t('ads.create-ad')}</Button>
        </div>

        <Filters key={JSON.stringify(searchParams)} categories={categories} regions={regions} />

        {ads.map(ad => {
            return <AdListingResult key={ad.uuid} data={ad} />
        })}

        {!ads.length && <div className="bg-base-200 p-5 my-2 rounded-box shadow-sm"><p className="text-center">{t('ads.no-results')}</p></div>}

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
        <SeoSiteDescriptor />
    </>
}

