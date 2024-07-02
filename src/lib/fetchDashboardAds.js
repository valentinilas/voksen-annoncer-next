"use server";

import { cdnUrl } from "@/utils/imagekit/cdn-url";
import { createClient } from "@/utils/supabase/server";
import { fetchCurrentUser } from "./fetchCurrentUser";

export async function fetchDashboardAds() {
    const supabase = createClient();

    const currentUser = await fetchCurrentUser();

    const profileId = currentUser?.user?.id;
    // console.log(profileId);

    if (!profileId) {
        return { ads: [], error: "Profile not available" }
    }
    

    try {
        const { data: ads, error } = await supabase
            .from('ads')
            .select(`*, 
                    regions (region_name),
                    ad_images (uuid, image_url, image_width, image_height),
                    ad_categories (
                        category_id,
                        category_name,
                        slug
                    ),
                    ad_sub_categories (
                        sub_category_id,
                        sub_category_name
                    )
                    ad_images (uuid, image_url, image_width, image_height)`)
            .eq('user_id', profileId)
            .order('created_at', { ascending: false });

        if (error) throw error;

        // Transform image URLs using cdnUrl
        const transformedAds = ads.map(ad => ({
            ...ad,
            ad_images: ad.ad_images.map(image => ({
                ...image,
                image_url: cdnUrl(image.image_url, 300, 300)
            }))
        }));

        return { ads: transformedAds, error: null }

    } catch (error) {
        return { ads: null, error: error.message }
    }
};

