import { revalidateTag } from 'next/cache';
 
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  if (searchParams?.secret !== process.env.NEXT_REVALIDATE_PATH_TOKEN) {
    return new Response(`Invalid credentials`, {
      status: 500,
    });
  }
  revalidateTag('public-posts');

  return new Response(
    {
      revalidated: true,
      now: Date.now(),
    },
    {
      status: 200,
    },
  );
}