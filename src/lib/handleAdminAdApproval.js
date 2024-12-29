'use server';
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from 'next/cache';

export async function handleAdminAdApproval(ad) {
    const supabase = await createClient();
    try {
        const newStatus = !ad.is_approved;
        const { error } = await supabase
            .from('ads')
            .update({ is_approved: newStatus })
            .eq('uuid', ad.uuid)
            .single();

        if (error) {
            throw new Error('Error toggling ad approval status: ' + error.message);
        }

         // Revalidate the cache for the admin ads path
         revalidatePath('/api/get-admin-ads');

         return { success: true, is_approved: newStatus };

    } catch (error) {
        console.error(error); // Log the error for debugging
        return {error: error.message};
    }


}
