

import { createClient } from "@/utils/supabase/server";

export const fetchCategories = async () => {

    const supabase = createClient();

    try {
        let { data, error } = await supabase
            .from('ad_categories')
            .select('*, ad_sub_categories(*)')
            .order('category_id', { ascending: true });

        if (error) {
            throw error;
        }
        return { categories: data, categoriesError: null };
    } catch (error) {
        console.error('Error fetching data:', error);
        return { categories: [], categoriesError: error.message }
    }
};

