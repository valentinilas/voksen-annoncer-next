export const apiFetchRegions = async () => {
    try {
        const req = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/get-regions`, {
            cache: 'force-cache',
            next: { tags: ['regions'], revalidate: 3600 },
        });

        if (!req.ok) {
            throw new Error(`Failed to fetch Regions: ${req.status}`);
        }
        const response = await req.json();
        return response;
    } catch (error) {
        console.error('Error fetching regions:', error);
        throw error;
    }
};




export const apiFetchPosts = async ( { category, subcategory, region, search, page, pageSize } ) => {
    try {
         const req = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/get-public-posts?category=${category}&subcategory=${subcategory}&region=${region}&search=${search}&page=${page}&pageSize=${pageSize}`, {
            cache: 'force-cache',
            next: { tags: ['public-posts'], revalidate: 3600 }
        });

        if (!req.ok) {
            throw new Error(`Failed to fetch Regions: ${req.status}`);
        }
        const response = await req.json();
        return response;
    } catch (error) {
        console.error('Error fetching regions:', error);
        throw error;
    }
};


export const apiFetchSinglePost = async (slug) => {
    try {
        const req = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/posts/${slug}`, {
            cache: 'force-cache',
            next: { tags: ['post'], revalidate: 3600 },
        });

        if (!req.ok) {
            throw new Error(`Failed to fetch post: ${req.status}`);
        }

        const response = await req.json();
        return response;
    } catch (error) {
        console.error('Error fetching post:', error);
        throw error;
    }
};

export const apiFetchAllPublicPosts = async () => {
    try {
        const req = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/get-all-public-posts`, {
            cache: 'force-cache',
            next: { tags: ['post'], revalidate: 3600 },
        });

        if (!req.ok) {
            throw new Error(`Failed to fetch post: ${req.status}`);
        }

        const response = await req.json();
        return response;
    } catch (error) {
        console.error('Error fetching post:', error);
        throw error;
    }
};

// Articles
export const apiFetchAllPublicArticles = async () => {
    try {
        const req = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/get-all-public-articles`, {
            cache: 'force-cache',
            next: { tags: ['public-articles'], revalidate: 3600 },
        });

        if (!req.ok) {
            throw new Error(`Failed to fetch articles: ${req.statusText}`);
        }

        const response = await req.json();
        return response;
    } catch (error) {
        console.error('Error fetching articles:', error);
        throw error;
    }
};

export const apiFetchSingleArticle = async (slug) => {
    try {
        const req = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/get-article/${slug}`, {
            cache: 'force-cache',
            next: { tags: ['public-articles'], revalidate: 3600 },
        });

        if (!req.ok) {
            throw new Error(`Failed to fetch article: ${req.statusText}`);
        }

        const response = await req.json();
        return response;
    } catch (error) {
        console.error('Failed to fetch article:', error);
        throw error;
    }
};