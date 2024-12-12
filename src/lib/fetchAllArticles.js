export const fetchAllArticles = async (page = 1, limit = 10) => {
  try {
    // Build the URL with pagination parameters
    const res = await fetch(`https://cms.voksen-annoncer.com/api/posts?page=${page}&limit=${limit}`);
    
    if (!res.ok) {
      throw new Error(`Failed to fetch articles: ${res.statusText}`);
    }

    const data = await res.json();

    // Assuming `data.docs` contains the list of articles and `data.totalDocs` provides total count
    const articles = data.docs || [];
    const total = data.totalDocs || articles.length;
    const totalPages = Math.ceil(total / limit); // Calculate total pages

    return { articles, total, totalPages, error: null };
  } catch (error) {
    console.error('Error fetching data:', error);
    return { articles: [], total: 0, totalPages: 0, error: error.message };
  }
};
