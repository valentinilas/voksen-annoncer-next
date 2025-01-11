import { createClient } from "@/utils/supabase/client";
import { cdnUrl } from "@/utils/imagekit/cdn-url";

export const fetchRandomPublicAds = async (count = 6) => {
    const supabase = createClient();
    try {
        const { data: ads, error } = await supabase
            .rpc('get_random_ads', {
                count
            })



        if (error) {
            throw new Error(`Failed to fetch ads: ${error.message}`);
        }

        const transformedAds = ads.map(ad => ({
            ...ad,
            ad_images: ad.ad_images?.map(image => ({
                ...image,
                image_url: cdnUrl(image.image_url, 300, 300)
            }))
        }));

        return { ads: transformedAds, error: null };
    } catch (error) {
        console.error('Error fetching random ads:', error);
        throw error;
    }
};