"use server";

import { createClient } from "@/utils/supabase/server";


export const fetchPostAnalytics = async (page_slug) => {
    const supabase = await createClient();
    try {
        const { data, error } = await supabase
            .from('ad_analytics')
            .select('*')
            .eq('slug', page_slug)
            .single();

        if (error) {
            throw new Error(error.message); // Throw the error if there is one
        }
        return { data, analyticsError: null }; // Return user and no error
    } catch (error) {
        return { data: null, analyticsError: error }; // Return user and no error
    }
};

