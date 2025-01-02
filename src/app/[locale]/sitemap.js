import { fetchAllPublicAds } from "@/lib/fetchAllPublicAds";
import { fetchCategories } from "@/lib/fetchCategories";
// import { fetchRegions } from "@/lib/fetchRegions";
import { fetchAllArticles } from "@/lib/fetchAllArticles";

const locales = ['en', 'da'];


export default async function Sitemap() {

    const { ads } = await fetchAllPublicAds();
    const { categories } = await fetchCategories();
    // const { regions } = await fetchRegions();
    const { articles } = await fetchAllArticles();

    // Regions
    const regionsRequest = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/get-regions`, {
        next: { tags: ['regions'] }
    });

    if (!regionsRequest.ok) {
        throw new Error(`Failed to fetch Regions: ${res.status}`);
    }

    const { regions } = await regionsRequest.json();

    const createLocalizedEntries = (path, options = {}) =>
        locales.map(locale => ({
            url: `${process.env.NEXT_PUBLIC_BASE_URL}/${locale}${path}`,
            ...options
        }));
    const createDanishEntries = (path, options = {}) =>
        locales
            .filter(locale => locale === 'da') // Filter to only include Danish locale
            .map(locale => ({
                url: `${process.env.NEXT_PUBLIC_BASE_URL}/${locale}${path}`,
                ...options
            }));

    // Ads
    const adEntries = ads.flatMap(({ slug, created_at }) =>
        createLocalizedEntries(`/posts/${slug}`, {
            lastModified: new Date(created_at),
            changeFrenquency: 'never'
        })
    );

    // Categories 
    const categoryEntries = categories.flatMap(({ slug }) =>
        createLocalizedEntries(`/category/${slug}`, {
            changeFrenquency: 'never'
        })
    );
    // Subcategories
    const subCategoryEntries = categories.flatMap(category =>
        category.ad_sub_categories.flatMap(({ slug }) =>
            createLocalizedEntries(`/category/${slug}`, {
                changeFrenquency: 'never'
            })
        )
    );

    // Regions
    const regionEntries = regions.flatMap(({ slug }) =>
        createLocalizedEntries(`/location/${slug}`, {
            changeFrenquency: 'never'
        })
    );

    // Articles
    const articleEntries = articles.flatMap(({ Slug, createdAt }) =>
        createDanishEntries(`/articles/${Slug}`, {
            lastModified: new Date(createdAt),
            changeFrenquency: 'never'
        })
    );

    // Static pages
    const staticPages = [
        '/about',
        '/support',
        '/new-post',
        '/dashboard',
        '/sign-up',
        '/sign-in'
    ];

    const staticEntries = staticPages.flatMap(page =>
        createLocalizedEntries(page)
    );

    // Home pages for each locale
    const homeEntries = locales.map(locale => ({
        url: `${process.env.NEXT_PUBLIC_BASE_URL}/${locale}`
    }));

    return [
        ...homeEntries,
        ...staticEntries,
        ...adEntries,
        ...categoryEntries,
        ...subCategoryEntries,
        ...regionEntries,
        ...articleEntries
    ]
}