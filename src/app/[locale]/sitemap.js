import { fetchAllPublicAds } from "@/lib/fetchAllPublicAds";
import { fetchCategories } from "@/lib/fetchCategories";
import slugify from "slugify";

export default async function Sitemap() {
    const { ads } = await fetchAllPublicAds();
    const { categories } = await fetchCategories();
    // Ads
    const adEntries = ads.map(({ slug, created_at }) => ({
        url: `${process.env.NEXT_PUBLIC_BASE_URL}/${slug}`,
        lastModified: new Date(created_at),
        changeFrenquency: 'never'
    }));

    // Categories 
    const categoryEntries = categories.map(({ category_name }) => ({
        url: `${process.env.NEXT_PUBLIC_BASE_URL}/category/${slugify(category_name, { lower: true, strict: true })}`,
        changeFrenquency: 'never'
    }))



    return [
        {
            url: `${process.env.NEXT_PUBLIC_BASE_URL}/posts`
        },
        {
            url: `${process.env.NEXT_PUBLIC_BASE_URL}/about`
        },
        {
            url: `${process.env.NEXT_PUBLIC_BASE_URL}/support`
        },
        {
            url: `${process.env.NEXT_PUBLIC_BASE_URL}/da`
        },
        {
            url: `${process.env.NEXT_PUBLIC_BASE_URL}/en`
        },
        {
            url: `${process.env.NEXT_PUBLIC_BASE_URL}/new-post`
        },
        {
            url: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard`
        },
        {
            url: `${process.env.NEXT_PUBLIC_BASE_URL}/sign-up`
        },
        {
            url: `${process.env.NEXT_PUBLIC_BASE_URL}/sign-in`
        },
        ...adEntries,
        ...categoryEntries
    ]
}