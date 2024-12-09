

import { createClient } from "@/utils/supabase/server";

export const fetchSubCategories = async () => {

    const supabase = await createClient();

    try {
        let { data, error } = await supabase
            .from('ad_sub_categories')
            .select('*')
            .order('sub_category_id', { ascending: true });
        if (error) {
            throw error;
        }
        return { subCategories: data, subCategoriesError: null };
    } catch (error) {
        console.error('Error fetching data:', error);
        return { subCategories: [], subCategoriesError: error.message }
    }
};

