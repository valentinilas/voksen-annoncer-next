

import { fetchRegions } from "@/lib/fetchRegions";

export async function GET(req) {
  try {
    const { regions, regionsError:error } = await fetchRegions();

    if (error) {
      throw new Error(error);
    }

    // Set cache headers
    return new Response(JSON.stringify({ regions }), {
      status: 200,
      headers: {
        'Cache-Control': 's-maxage=2592000, stale-while-revalidate',
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