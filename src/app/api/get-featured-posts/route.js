import { fetchRandomPublicAds } from "@/lib/fetchRandomAds";

export async function GET(req) {
    try {
        const { featuredAds, error } = await fetchRandomPublicAds();
        if (error) {
            throw new Error(error);
        }

        // Set cache headers, cache for 1 hour
        return new Response(JSON.stringify({ featuredAds }), {
          status: 200,
          headers: {
            'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=59', 
            'Content-Type': 'application/json',
          },
        });

    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }
}

