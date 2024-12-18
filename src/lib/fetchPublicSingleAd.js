import { createClient } from "@/utils/supabase/server";
import { cdnUrl } from "@/utils/imagekit/cdn-url";

export const fetchPublicSingleAd = async (slug) => {

    const supabase = await createClient();

    try {
        const { data: ad, error } = await supabase
            .from('ads')
            .select(`*, 
                regions (*), 
                profiles(*, genders (gender_name), 
                regions (*)), 
                ad_images(uuid, image_url, image_width, image_height),  
                ad_categories (
                    category_id,
                    category_name,
                    slug
                ),
                ad_sub_categories (
                    sub_category_id,
                    sub_category_name,
                    slug
                )
                `)
            .eq('slug', slug)
            .maybeSingle();

        if (error) {
            throw error;
        }
        // Transform image URLs using cdnUrl
        const transformedAd = {
            ...ad,
            ad_images: ad.ad_images.map(image => ({
                ...image,
                image_url: cdnUrl(image.image_url, 300, 300)
            }))
        };

        return {ad:transformedAd, adError:null}


    } catch (error) {
        console.error('Error fetching data:', error);
        return {ad:{}, adError:error}
    }
};

