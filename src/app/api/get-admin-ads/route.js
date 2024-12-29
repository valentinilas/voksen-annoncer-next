

import { fetchAdminAdList } from "@/lib/fetchAdminAdList";

export async function GET(req) {
  try {
    const { ads, error } = await fetchAdminAdList();

    if (error) {
      throw new Error(error);
    }

    // Set cache headers
    return new Response(JSON.stringify({ ads }), {
      status: 200,
      headers: {
        'Cache-Control': 's-maxage=1800, stale-while-revalidate',
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