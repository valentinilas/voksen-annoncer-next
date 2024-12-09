'use client';

import { createClient } from "@/utils/supabase/client";

export async function incrementPageViews(page_slug) {
    const supabase = await createClient();


    try {
        const viewedPages = JSON.parse(sessionStorage.getItem('viewedPages') || '[]')

        if (!viewedPages.includes(page_slug)) {
            viewedPages.push(page_slug)
            sessionStorage.setItem('viewedPages', JSON.stringify(viewedPages))

            const { data, error } = await supabase.rpc('increment_page_views', {
                page_slug: page_slug
            })

            if (error) throw error

            //   console.log('Page view incremented:', data)
            return data
        }

    } catch (error) {
        console.error('Error handling page view:', error)
        throw error
    }
}