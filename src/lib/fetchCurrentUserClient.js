'use client';

import { createClient } from "@/utils/supabase/client";

export const fetchCurrentUserClientSide = async () => {
    const supabase = createClient();
    try {
        const { data: userData, error: userError } = await supabase.auth.getUser();

        if (userError) {
            console.error("Error fetching user:", userError.message);
            return { user: null, userProfile: null, userError: userError.message };
        }

        const user = userData.user;

        if (user) {
            const { data: profileData, error: profileError } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', user.id)
                .single();

            if (profileError) {
                console.error("Error fetching user profile:", profileError.message);
                return { user, userProfile: null, userError: profileError.message };
            }

            return { user, userProfile: profileData, userError: null };
        }

        return { user: null, userProfile: null, userError: null };
    } catch (error) {
        console.error('Error fetching current user:', error);
        return { user: null, userProfile: null, userError: error.toString() };
    }
};