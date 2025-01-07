

import { fetchCategories } from '@/lib/fetchCategories';
import { NextResponse } from 'next/server';


export async function GET(req) {

  try {
    const { categories, categoriesError: error } = await fetchCategories();
    if (error) {
      throw new Error(error);
    }

    return NextResponse.json(
      { categories, timestamp: new Date().toISOString() },
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