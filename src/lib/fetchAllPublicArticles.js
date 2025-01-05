export const fetchAllPublicArticles = async () => {
    const baseUrl = 'https://cms.voksen-annoncer.com/api/posts';
    let articles = [];
    let page = 1;
    let hasMore = true;
  
    try {
      while (hasMore) {
        const res = await fetch(`${baseUrl}?page=${page}`);
  
        if (!res.ok) {
          throw new Error(`Failed to fetch articles: ${res.statusText}`);
        }
  
        const data = await res.json();
  
        // Append the articles from the current page
        articles = [...articles, ...data.docs];
        
        // Check if there are more pages
        hasMore = page < data.totalPages;
        page += 1;
      }
  
      return { articles, total: articles.length, error: null };
    } catch (error) {
      console.error('Error fetching data:', error);
      return { articles: [], total: 0, error: error.message };
    }
  };
  