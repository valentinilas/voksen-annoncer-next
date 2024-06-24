'use server';
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export const handleProfileUpdate = async (formData, profileId) => {
    const supabase = createClient();
    const newData = Object.fromEntries(formData.entries())
    if (newData.birthday) {
        // Create a date object
        const date = new Date(newData.birthday);
        // Adjust for the timezone offset
        date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
        // Convert to ISO string
        newData.birthday = date.toISOString().split('T')[0];
    }

    try {
        const { data, error } = await supabase
            .from('profiles')
            .update(newData)
            .eq('id', profileId)
            .select();

        if (error) {
            throw error;
        }

        console.log('Profile Updated', newData);

    } catch (error) {
        console.error("Error updating profile:", error);
        return { data: [], error: error.message };
    }
    // Revalidate the home page after deletion
    revalidatePath('/', 'layout');
};