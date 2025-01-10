

import { fetchSubCategories } from '@/lib/fetchSubCategories';
import { NextResponse } from 'next/server';


export async function GET(req) {

  try {
    const { subCategories, subCategoriesError: error } = await fetchSubCategories();
    if (error) {
      throw new Error(error);
    }

    return NextResponse.json(
      { subCategories, timestamp: new Date().toISOString() },
      {
        status: 200,
        headers: {
          'Cache-Control': 'public, s-maxage=2592000, stale-while-revalidate=59',
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