import { fetchPublicAds } from "@/lib/fetchPublicAds";
import { fetchCategories } from "@/lib/fetchCategories";
import { fetchSubCategories } from "@/lib/fetchSubCategories";
import AdListingResult from "@/components/ad-listing/ad-listing-result";
// import Filters from "@/components/filters/filters";
import Link from "next/link";
import { getTranslations } from "next-intl/server";


export async function generateMetadata({ params, searchParams }, parent) {
    const t = await getTranslations();
    const { categories } = await fetchCategories();
    const { subCategories } = await fetchSubCategories();

    const searchCategory = categories.find((category) => category.slug === params.query);
    const searchSubCategory = subCategories.find((subCategory) => subCategory.slug === params.query);

    const categoryName = searchCategory ? searchCategory.category_name : searchSubCategory ? searchSubCategory.sub_category_name : null;

    const translationKey = searchCategory ? `categories.${decodeURIComponent(searchCategory.category_name)}` : `subcategories.${decodeURIComponent(searchSubCategory.sub_category_name)}`;

    return {
        title: `${t("categories.category-title", { term: t(translationKey) })}`,

    };

}

export default async function CategoryPage({ params, searchParams }) {

    const { categories } = await fetchCategories();
    const { subCategories } = await fetchSubCategories();


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
    const categoryId = searchCategory?.category_id || null;
    const subCategoryId = searchSubCategory?.sub_category_id || null;
    const { ads, total } = await fetchPublicAds(categoryId, subCategoryId, null, null, page, pageSize);


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

