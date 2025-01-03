import { createClient } from "@/utils/supabase/server";

export const fetchRegions = async () => {
    const supabase = await createClient();

    try {
        let { data, error } = await supabase
            .from('regions')
            .select('*');

        if (error) {
            throw error;
        }
        return { regions: data, regionsError: null };
    } catch (error) {
        console.error('Error fetching data:', error);
        return { regions: [], regionsError: error };
    }
};

