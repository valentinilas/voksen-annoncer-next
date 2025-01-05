

import { fetchRegions } from "@/lib/fetchRegions";
import { NextResponse } from 'next/server';


export const revalidate = 3600; // This is key for enabling route handler caching
export async function GET(req) {

  try {
    const { regions, regionsError:error } = await fetchRegions();

    if (error) {
      throw new Error(error);
    }

    return NextResponse.json(
      { regions, timestamp: new Date().toISOString() },
      {
        status: 200,
        headers: {
          'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=59',
        },
      }
    );
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}