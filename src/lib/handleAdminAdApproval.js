'use server';
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from 'next/cache';
import { revalidateTag } from 'next/cache';


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

        // Invalidate the cache for the public ads
    revalidateTag('public-ads');

        // console.log(`Ad ${ad.uuid} approval status changed to ${newStatus}`);

    } catch (error) {
        console.error(error); // Log the error for debugging
        return {error: error.message};
    }

    revalidatePath('/');

}
