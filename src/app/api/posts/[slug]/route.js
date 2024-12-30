import { fetchPublicSingleAd } from "@/lib/fetchPublicSingleAd";

export async function GET(req, { params }) {
  try {
    const { slug } = params;
    const { ad, adError } = await fetchPublicSingleAd(slug);
    if (adError) {
      return new Response(JSON.stringify({ error: adError.message }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    // Cache for 1 day (86400 seconds)
    return new Response(JSON.stringify({ ad }), {
      status: 200,
      headers: {
        'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate',
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