'use server';
import { createClient } from "@/utils/supabase/server";

export const fetchGenders = async () => {
    const supabase = await createClient();

    try {
        let { data, error } = await supabase
        .from('genders')
        .select('*');

        if (error) {
            throw error;
        }
        return { genders: data, error: null };
    } catch (error) {
        console.error('Error fetching data:', error.message);
        return { genders: [], error: error.message };
    }
};

