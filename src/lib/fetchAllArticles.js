import { createClient } from "@/utils/supabase/server";
export const fetchAllArticles = async () => {

  const supabase = await createClient();

  try {
    let query = supabase
      .from('articles')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })

    const { data: articles, error, count } = await query;

    if (error) {
      throw error;
    }

    return { articles, total: count, error: null };
  } catch (error) {
    console.error('Error fetching data:', error);
    return { articles: [], total: 0, error: error.message };
  }
};
