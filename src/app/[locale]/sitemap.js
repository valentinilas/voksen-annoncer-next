import { fetchAllPublicAds } from "@/lib/fetchAllPublicAds";

export default async function Sitemap() {
    const { ads } = await fetchAllPublicAds();
    const adEntries = ads.map(({ slug, created_at }) => ({
        url: `${process.env.NEXT_PUBLIC_BASE_URL}/${slug}`,
        lastModified: new Date(created_at),
        changeFrenquency: 'never'
    }));

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
        ...adEntries
    ]
}