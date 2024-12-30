import { fetchPublicAds } from "@/lib/fetchPublicAds";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get('category') || 'all';
  const subcategory = searchParams.get('subcategory') || 'all';
  const region = searchParams.get('region') || 'all';
  const search = searchParams.get('search') || '';
  const page = parseInt(searchParams.get('page'), 10) || 1;
  const pageSize = parseInt(searchParams.get('pageSize'), 10) || 10;

  try {
    const { ads, total, error } = await fetchPublicAds(category, subcategory, region, search, page, pageSize);

    if (error) {
      throw new Error(error);
    }

    // Set cache headers
    return new Response(JSON.stringify({ ads, total }), {
      status: 200,
      headers: {
        'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate',
        'Content-Type': 'application/json',
        'Cache-Tag': 'public-ads',
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