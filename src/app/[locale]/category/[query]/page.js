import { fetchPublicAds } from "@/lib/fetchPublicAds";
import AdListingResult from "@/components/ad-listing/ad-listing-result";
// import Filters from "@/components/filters/filters";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { apiFetchCategories } from "@/utils/api/fetch-helpers";
import { apiFetchSubCategories } from "@/utils/api/fetch-helpers";
import { generateAlternatesBlock } from "@/utils/generate-canonical/generateAlternatesBlock";

export async function generateMetadata({ params, searchParams }) {
    const { locale, query } = await params
    const t = await getTranslations();
    const { categories } = await apiFetchCategories();
    const { subCategories } = await apiFetchSubCategories();

    const searchCategory = categories.find((category) => category.slug === query);
    const searchSubCategory = subCategories.find((subCategory) => subCategory.slug === query);


    const translationKey = searchCategory ? `categories.${decodeURIComponent(searchCategory.category_name)}` : `subcategories.${decodeURIComponent(searchSubCategory.sub_category_name)}`;

    return {
        title: `${t("categories.category-title", { term: t(translationKey) })}`,
        description: `${t("categories.category-description", { term: t(translationKey) })}`,
        alternates: generateAlternatesBlock(locale, `/category/${query}`, await searchParams)

    };
}




export default async function CategoryPage(props) {
    const searchParams = await props.searchParams;
    const params = await props.params;

    const { categories } = await apiFetchCategories();
    const { subCategories } = await apiFetchSubCategories();


    const searchCategory = categories.find((category) => category.slug === params.query);
    const searchSubCategory = subCategories.find((subCategory) => subCategory.slug === params.query);


    const t = await getTranslations();
    if (!searchCategory && !searchSubCategory) {
        return <>
            <p className="text-center">{t("ads.no-results")}</p>
        </>
    }

    const pageSize = 10;
    const { page = 1 } = searchParams;
    const categoryId = searchCategory?.category_id || 'all';
    const subCategoryId = searchSubCategory?.sub_category_id || 'all';
    // const { ads, total } = await fetchPublicAds(categoryId, subCategoryId, null, null, page, pageSize);

    // Fetch ads from the new API endpoint
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/get-public-posts?category=${categoryId}&subcategory=${subCategoryId}&page=${page}&pageSize=${pageSize}`, {
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

    const translationKey = searchCategory ? `categories.${decodeURIComponent(searchCategory.category_name)}` : `subcategories.${decodeURIComponent(searchSubCategory.sub_category_name)}`;


    return <>

        {/* <IntroBanner /> */}
        {/* <Filters key={JSON.stringify(searchParams)} categories={categories} regions={regions} /> */}
        {/* <h1 className="text-3xl mb-5">{t(`categories.${decodeURIComponent(searchCategory?.category_name)}`)}</h1> */}
        <h1 className="text-3xl mb-5">{t(translationKey)}</h1>

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

