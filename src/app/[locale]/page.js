import { fetchPublicAds } from "@/lib/fetchPublicAds";
import { fetchCategories } from "@/lib/fetchCategories";
import { fetchRegions } from "@/lib/fetchRegions";
import AdListingResult from "@/components/ad-listing/ad-listing-result";
import Filters from "@/components/filters/filters";

import { Link } from '@/i18n/routing';

import { getTranslations } from "next-intl/server";
import IntroBanner from "@/components/intro-banner/intro-banner";
import SeoSiteDescriptor from "@/components/seo-site-descriptor/seoSiteDescriptor";
import Button from "@/components/button/button";
import { PlusIcon } from "@heroicons/react/24/outline";
import Image from "next/image";

export default async function Ads(props) {
    const searchParams = await props.searchParams;
    const t = await getTranslations();
    const pageSize = 10;
    const { category = 'all', subcategory = 'all', region = 'all', search = '', page = 1 } = searchParams;
    const { categories } = await fetchCategories();
    const { regions } = await fetchRegions();
    // const { ads, total } = await fetchPublicAds(category, subcategory, region, search, page, pageSize);

    // Fetch ads from the new API endpoint
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/get-public-posts?category=${category}&subcategory=${subcategory}&region=${region}&search=${search}&page=${page}&pageSize=${pageSize}`, {
        next: {tags: ['public-posts'] } 
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
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-5">
            {/* <h1 className="text-2xl">{t("navigation.ads")} ({total})</h1> */}
            <h1 className="text-2xl">{t("about.welcome")}</h1>
            <div><span className="mr-9 relative font-medium text-cherry-700">{t('ads.start-here')} <Image className="absolute top-0 left-full" src='/elements/arrow.svg' alt="Arrow" width="32" height="32" /></span><Button Icon={PlusIcon} to="/new-post" className="inline-flex">{t('ads.create-ad')}</Button></div>
        </div>

        <div className="grid grid-cols-12 gap-5">
            <div className="col-span-12 md:col-span-3">
                <Filters key={JSON.stringify(searchParams)} categories={categories} regions={regions} />
            </div>
            <div className="col-span-12 md:col-span-9">
                {ads.map(ad => {
                    return <AdListingResult key={ad.uuid} data={ad} />
                })}
                {!ads.length && <div className="bg-base-100 p-5  rounded-box shadow-sm h-full"><p className="text-center">{t('ads.no-results')}</p></div>}
            </div>

        </div>






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

