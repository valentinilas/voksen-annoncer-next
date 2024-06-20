import { createClient } from "@/utils/supabase/server";
import { cdnUrl } from "@/utils/imagekit/cdn-url";
export const fetchPublicAds = async (category, subCategory, region, searchTerm, page = 0, pageSize = 10) => {
  const supabase = createClient();

  try {
    let query = supabase
      .from('ads')
      .select(`
        *,
        regions (region_name),
        ad_images (uuid, image_url, image_width, image_height),
        ad_categories (category_id, category_name),
        ad_sub_categories (sub_category_id, sub_category_name),
        profiles(username)
      `, { count: 'exact' })
      .eq('is_approved', true)
      .order('created_at', { ascending: false })
      .range((page - 1) * pageSize, page * pageSize - 1);

    if (category && category !== 'all') {
      query = query.eq('category_id', category);
    }
    if (subCategory && subCategory !== 'all') {
      query = query.eq('sub_category_id', subCategory);
    }
    if (region && region !== 'all') {
      query = query.eq('region_id', region);
    }
    if (searchTerm) {
      query = query.ilike('title', `%${searchTerm}%`);
    }

    const { data: ads, error, count } = await query;

    console.log(ads);
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

    return { ads: transformedAds, total: count };
  } catch (error) {
    console.error('Error fetching data:', error);
    return { ads: [], total: 0, error: error.message };
  }
};
