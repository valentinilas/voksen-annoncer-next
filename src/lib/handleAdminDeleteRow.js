'use server';

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from 'next/cache';

export async function handleAdminDeleteRow(adId) {
    const supabase = createClient();

    try {
        // Fetch ad images to be deleted
        const { data: adImages, error: fetchError } = await supabase
            .from('ad_images')
            .select('image_url')
            .eq('ad_id', adId);

        if (fetchError) {
            throw new Error('Error fetching ad images: ' + fetchError.message);
        }

        // If there are images, delete them
        if (adImages && adImages.length > 0) {
            // Prepare an array of file paths to delete
            const filePaths = adImages.map(image => {
                const parts = image.image_url.split('/');
                return 'ad-images/' + parts.pop(); // Assuming 'ad-images/' is the correct prefix
            });

            // Delete all images from storage in one request
            const { error: deleteError } = await supabase.storage
                .from('voksen-annoncer')
                .remove(filePaths);

            if (deleteError) {
                throw new Error('Error deleting images: ' + deleteError.message);
            }
        }

        // Delete the ad record itself
        const { error: deleteAdError } = await supabase
            .from('ads')
            .delete()
            .eq('uuid', adId);

        if (deleteAdError) {
            throw new Error('Error deleting ad: ' + deleteAdError.message);
        }

        // Success messages and updates
        // console.log('Ad and associated images deleted successfully.');
        revalidatePath('/', 'layout');

    } catch (error) {
        console.error('Delete operation failed:', error);
        return { error: error.message };
    }

}
