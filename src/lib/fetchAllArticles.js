// import { createClient } from "@/utils/supabase/server";
// export const fetchAllArticles = async () => {

//   const supabase = await createClient();

//   try {
//     let query = supabase
//       .from('articles')
//       .select('*', { count: 'exact' })
//       .order('created_at', { ascending: false })

//     const { data: articles, error, count } = await query;

//     if (error) {
//       throw error;
//     }

//     return { articles, total: count, error: null };
//   } catch (error) {
//     console.error('Error fetching data:', error);
//     return { articles: [], total: 0, error: error.message };
//   }
// };

export const fetchAllArticles = async () => {
  try {
    const res = await fetch('https://cms.voksen-annoncer.com/api/posts');
    if (!res.ok) {
      throw new Error(`Failed to fetch articles: ${res.statusText}`);
    }

    const data = await res.json();

    // Assuming `data.docs` contains the list of articles (PayloadCMS typical response structure)
    const articles = data.docs || [];
    const total = data.totalDocs || articles.length;

    return { articles, total, error: null };
  } catch (error) {
    console.error('Error fetching data:', error);
    return { articles: [], total: 0, error: error.message };
  }
};
