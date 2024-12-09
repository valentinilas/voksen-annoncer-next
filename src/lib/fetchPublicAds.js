import { createClient } from "@/utils/supabase/server";
import { cdnUrl } from "@/utils/imagekit/cdn-url";
export const fetchPublicAds = async (category, subcategory, region, search, page, pageSize) => {

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
      .range((Number(page) - 1) * pageSize, Number(page) * pageSize - 1);

    query = query.limit(100); // Example limit




    if (category && category !== 'all') {
      query = query.eq('category_id', category);
    }
    if (subcategory && subcategory !== 'all') {
      query = query.eq('sub_category_id', subcategory);
    }
    if (region && region !== 'all') {
      query = query.eq('region_id', region);
    }

    if (search) {
      const sanitizedSearch = search.replace(/[^\w\s]/gi, '');

      query = query.ilike('title', `%${sanitizedSearch}%`);
    }

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
