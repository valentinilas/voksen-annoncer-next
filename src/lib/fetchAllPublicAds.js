import { createClient } from "@/utils/supabase/server";
import { cdnUrl } from "@/utils/imagekit/cdn-url";
export const fetchAllPublicAds = async () => {
  
  const supabase = await createClient();

  try {
    let query = supabase
      .from('ads')
      .select(`
        *,
        regions (*),
        ad_images (uuid, image_url, image_width, image_height),
        ad_categories (category_id, category_name, slug),
        ad_sub_categories (sub_category_id, sub_category_name, slug),
        profiles(username)
      `, { count: 'exact' })
      .eq('is_approved', true)
      .order('created_at', { ascending: false })

    const { data: ads, error, count } = await query;

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

    return { ads: transformedAds, total: count, error: null };
  } catch (error) {
    console.error('Error fetching data:', error);
    return { ads: [], total: 0, error: error.message };
  }
};
