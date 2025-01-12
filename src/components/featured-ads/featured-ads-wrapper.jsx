

import { apiFetchFeaturedPublicPosts } from "@/utils/api/fetch-helpers";

import { FeaturedAds } from "./featured-ads";

export default async function FeaturedAdsWrapper({ vertical = false }) {
    const { featuredAds } = await apiFetchFeaturedPublicPosts();
    return <FeaturedAds featuredAds={featuredAds} vertical={vertical} />
}