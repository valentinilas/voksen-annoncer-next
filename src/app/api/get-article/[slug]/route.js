import { fetchSingleArticle } from "@/lib/fetchSingleArticle";

export async function GET(req, { params }) {

  try {
    const { slug } = await params;
    const { article, articleError } = await fetchSingleArticle(slug);
    if (articleError) {
      return new Response(JSON.stringify({ error: articleError.message }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    return new Response(JSON.stringify({ article }), {
      status: 200,
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=59', 
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


