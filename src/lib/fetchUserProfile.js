'use server';

import { createClient } from "@/utils/supabase/server";

export const fetchUserProfile = async (profileId) => {
    const supabase = createClient();
    try {
        const { data: userProfile, error } = await supabase
            .from('profiles')
            .select(`*, regions(region_name), genders(gender_name)`)
            .eq('id', profileId)
            .single();

        if (error) {
            throw new Error(error.message); // Throw the error if there is one
        }
        return { userProfile, userProfileError: null }; // Return user and no error
    } catch (error) {
        return { userProfile: null, userProfileError: error }; // Return user and no error
    }
};