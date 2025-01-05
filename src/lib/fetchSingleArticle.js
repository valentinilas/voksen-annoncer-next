export const fetchSingleArticle = async (slug) => {
  if (!slug) {
    return { article: null, articleError: new Error('Slug is required') };
  }

  try {
    const res = await fetch(`https://cms.voksen-annoncer.com/api/posts?where[Slug][equals]=${slug}`);

    // Check if the response is ok (status code 200)
    if (!res.ok) {
      throw new Error(`Failed to fetch post: ${res.statusText}`);
    }

    // Parse the JSON response
    const article = await res.json();
    
    // Assuming 'docs' contains the posts, return the first post
    return { article: article.docs[0], articleError: null };

  } catch (error) {
    console.error('Error fetching data:', error);
    return { article: {}, articleError: error.message };
  }
};
