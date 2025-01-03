"use server";

import { cdnUrl } from "@/utils/imagekit/cdn-url";
import { createClient } from "@/utils/supabase/server";


export const fetchAdminAdList =  async () => {
    const supabase = await createClient();


    try {
        let query = supabase
            .from('ads')
            .select(`
                    *,
                    regions (region_name),
                     profiles(username),
                    ad_images (uuid, image_url, image_width, image_height),
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
            .order('created_at', { ascending: false })
            .range(0, 9); // Fetch the latest 10 ads

        const { data: ads, error } = await query;

        if (error) {
            throw error;
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
        console.error('Error fetching data:', error);
        return { ads: [], error: error.message };
    }





};

