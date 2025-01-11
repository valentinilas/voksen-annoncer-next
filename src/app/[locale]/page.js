import { fetchPublicAds } from "@/lib/fetchPublicAds";
import AdListingResult from "@/components/ad-listing/ad-listing-result";
import Filters from "@/components/filters/filters";

import { Link } from '@/i18n/routing';

import { getTranslations } from "next-intl/server";
import IntroBanner from "@/components/intro-banner/intro-banner";
import SeoSiteDescriptor from "@/components/seo-site-descriptor/seoSiteDescriptor";
import Button from "@/components/button/button";
import { PlusIcon } from "@heroicons/react/24/outline";
import Image from "next/image";

// Api
import { apiFetchFeaturedPublicPosts, apiFetchRegions } from "@/utils/api/fetch-helpers";
import { apiFetchPosts } from "@/utils/api/fetch-helpers";
import { apiFetchCategories } from "@/utils/api/fetch-helpers";

import {FeaturedAds} from "@/components/featured-ads/featured-ads";

export async function generateMetadata({ params }) {

    const { locale } = await params
    const t = await getTranslations();

    try {


        return {
            title: "Gratis annoncer for massage, sex, escort, swingers | Voksenannoncer",
            description: "Udforsk og opret gratis voksenannoncer på vores  platform. Nem, hurtig og sikker måde at dele dine annoncer på. Start i dag og nå ud til flere!",
            alternates: {
                canonical: `https://www.voksen-annoncer.com/${locale}`,
                languages: {
                    'en': `https://www.voksen-annoncer.com/en`,
                    'da': `https://www.voksen-annoncer.com/da`
                },
            },
            openGraph: {
                title: "Gratis annoncer for massage, sex, escort, swingers | Voksenannoncer",
                description: "Udforsk og opret gratis voksenannoncer på vores  platform. Nem, hurtig og sikker måde at dele dine annoncer på. Start i dag og nå ud til flere!",
                url: `https://www.voksen-annoncer.com/${locale}`,
                siteName: t("navigation.site-name"),
                locale: locale,
                type: 'website',
                images: [
                    {
                        url: '/og/og-banner.jpg',
                        width: 1200,
                        height: 630,
                        alt: "Gratis annoncer for massage, sex, escort, swingers | Voksenannoncer", // Accessible text for the image
                    },
                ],
            },


        };
    } catch (error) {
        console.error("Failed to fetch ad data:", error);
        return {
            title: "Gratis annoncer for massage, sex, escort, swingers | Voksenannoncer",
            description: "Udforsk og opret gratis voksenannoncer på vores  platform. Nem, hurtig og sikker måde at dele dine annoncer på. Start i dag og nå ud til flere!",
        };
    }
}

export default async function Ads(props) {
    const searchParams = await props.searchParams;
    const { locale } = await props.params;
    const t = await getTranslations();
    const pageSize = 20;
    const { category = 'all', subcategory = 'all', region = 'all', search = '', page = 1 } = searchParams;
    const { categories } = await apiFetchCategories();
    const { regions } = await apiFetchRegions();
    const x = await apiFetchFeaturedPublicPosts();
    const { featuredAds } = await apiFetchFeaturedPublicPosts();
    const { ads, total } = await apiFetchPosts({ category, subcategory, region, search, page, pageSize });
    const totalPages = Math.ceil(total / pageSize);

    const buildUrl = (newPage) => {
        const params = new URLSearchParams(searchParams);
        params.set('page', newPage.toString());
        return `?${params.toString()}`;
    };


    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "WebPage",
        name: `${t("navigation.about")} | ${t("navigation.site-name")}`,
        description: "Udforsk og opret gratis voksenannoncer på vores  platform. Nem, hurtig og sikker måde at dele dine annoncer på. Start i dag og nå ud til flere!",
        url: `https://www.voksen-annoncer.com/da/about`,
        inLanguage: locale,
        publisher: {
            "@type": "Organization",
            name: t("navigation.site-name"),
            logo: {
                "@type": "ImageObject",
                url: "/logo/logo_flat_200x200.png",
            },
        },
        image: {
            "@type": "ImageObject",
            url: "/og/og-banner.jpg",
            width: 1200,
            height: 630,
        },
    };


    return <>
        {/* Add JSON-LD to your page */}
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        {/* Featured ads */}
        <FeaturedAds featuredAds={featuredAds} />

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

