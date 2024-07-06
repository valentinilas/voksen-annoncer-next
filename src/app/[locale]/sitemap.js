import { fetchAllPublicAds } from "@/lib/fetchAllPublicAds";
import { fetchCategories } from "@/lib/fetchCategories";
import { fetchRegions } from "@/lib/fetchRegions";

import slugify from "slugify";

export default async function Sitemap() {
    const { ads } = await fetchAllPublicAds();
    const { categories } = await fetchCategories();
    const { regions } = await fetchRegions();
    // Ads
    const adEntries = ads.map(({ slug, created_at }) => ({
        url: `${process.env.NEXT_PUBLIC_BASE_URL}/${slug}`,
        lastModified: new Date(created_at),
        changeFrenquency: 'never'
    }));

    // Categories 
    const categoryEntries = categories.map(({ slug }) => ({
        url: `${process.env.NEXT_PUBLIC_BASE_URL}/category/${slug}`,
        changeFrenquency: 'never'
    }))

    // Regions
    const regionEntries = regions.map(({ slug }) => ({
        url: `${process.env.NEXT_PUBLIC_BASE_URL}/location/${slug}`,
        changeFrenquency: 'never'
    }))


    return [
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
        ...categoryEntries,
        ...regionEntries
    ]
}