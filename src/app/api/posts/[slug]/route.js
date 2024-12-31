import { fetchPublicSingleAd } from "@/lib/fetchPublicSingleAd";

export async function GET(req, { params }) {
  try {
    const { slug } = await params;
    const { ad, adError } = await fetchPublicSingleAd(slug);
    if (adError) {
      return new Response(JSON.stringify({ error: adError.message }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    // Cache for 1 week (7 days in seconds = 604800)
    return new Response(JSON.stringify({ ad }), {
      status: 200,
      headers: {
        'Cache-Control': 'public, s-maxage=604800, stale-while-revalidate=59', 
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


