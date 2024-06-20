import { createClient } from "@/utils/supabase/server";

export const fetchCurrentUser = async () => {
    const supabase = createClient();

    try {
        const { data: user, error } = await supabase.auth.getUser();

        if (error) {
            throw new Error(error.message); // Throw the error if there is one
        }

        return { user, userError: null }; // Return user and no error
    } catch (error) {
        console.error('Error fetching current user:', error);
        return { user: null, userError: error.toString() }; // Return null user and error details
    }
};