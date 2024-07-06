'use server';

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { handleLogout } from "./handle-log-out";

import { fetchCurrentUser } from "./fetchCurrentUser";

export const handleDeleteProfile = async () => {
    const supabase = createClient();

    try {
        const { user } = await fetchCurrentUser();
        // console.log(user);
        if (!user) {
            throw new Error('No current user');

        }

        const userId = user.id;

        // Fetch the user's ad images
        const { data: adImages, error: adImagesError } = await supabase
            .from('ad_images')
            .select('image_url')
            .eq('user_id', userId);

        if (adImagesError) {
            throw new Error('Error fetching ad images: ' + adImagesError.message);
        }

        // Prepare an array of file paths to delete
        const adImagePaths = adImages.map(image => {
            const parts = image.image_url.split('/');
            return 'ad-images/' + parts.pop(); // Assuming 'ad-images/' is the correct prefix
        });

        // Delete all ad images from storage in one request
        if (adImagePaths.length > 0) {
            const { error: deleteAdImagesError } = await supabase.storage
                .from('voksen-annoncer')
                .remove(adImagePaths);

            if (deleteAdImagesError) {
                throw new Error('Error deleting ad images: ' + deleteAdImagesError.message);
            }
        }

        // Fetch the user's profile to get the avatar URL
        const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('avatar_url')
            .eq('id', userId)
            .single();

        if (profileError) {
            throw new Error('Error fetching profile: ' + profileError.message);
        }

        // Delete the user's avatar image from storage
        if (profile && profile.avatar_url) {
            const parts = profile.avatar_url.split('/');
            const avatarPath = 'profile-images/' + parts.pop(); // Assuming 'ad-images/' is the correct prefix
            const { error: deleteAvatarError } = await supabase.storage
                .from('voksen-annoncer')
                .remove([avatarPath]);

            if (deleteAvatarError) {
                throw new Error('Error deleting avatar: ' + deleteAvatarError.message);
            }
        }

        // Call the RPC function to delete the user
        const { error } = await supabase.rpc('delete_user');

        if (error) {
            throw error;
        }

        // console.log('Account deletion successfull!');

        await supabase.auth.signOut();
        revalidatePath('/');




    }
    catch (error) {
        console.error('Error deleting account:', error.message);
        throw new Error(error.message);
    }

    redirect('/sign-in');
};