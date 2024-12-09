"use server";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

import { createAvatarServerValidationSchema } from "@/components/dashboard/avatar-server-validation-schema";
import { getTranslations } from "next-intl/server";

export const handleAvatarUpload = async (formData) => {
    const supabase = await createClient();

    const file = formData.get('image');
    const profileId = formData.get('profileId');

    if (!file) {
        return { error: "No file provided" };
    }


    const t = await getTranslations();
    const serverValidationSchema = createAvatarServerValidationSchema(t);



    // Validate the data
    try {
        await serverValidationSchema.validate({
            image:file
        }, { abortEarly: true });
    } catch (error) {
        console.error('Validation error:', error.errors);
        return { error: error.errors };
    }


    const getPublicUrl = async (filePath) => {
        // console.log('HANDLE GET PUBLIC URL');
        const { data, error } = supabase.storage.from('voksen-annoncer').getPublicUrl(filePath);
        if (error) {
            console.error('Error getting public URL:', error);
            return null;
        }
        return data.publicUrl;
    };

    const handleImageUpload = async (file) => {
        // console.log('HANDLE IMAGE UPLOAD');
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}.${fileExt}`;
        const filePath = `profile-images/${fileName}`;

        let { error } = await supabase.storage
            .from('voksen-annoncer')
            .upload(filePath, file);

        if (error) {
            console.error('Error uploading image:', error);
            return null;
        }

        return filePath;
    };


    try {
        const filePath = await handleImageUpload(file);
        const publicUrl = await getPublicUrl(filePath);

        if (!filePath) {
            console.error("File path missing")
        }
        const { data, error } = await supabase
            .from('profiles')
            .update({ avatar_url: publicUrl })
            .eq('id', profileId)
            .select();

        if (error) {
            return { error: error.message };
        }

        revalidatePath('/');
        return { success: true, data };


    } catch (error) {
        console.error("Error updating profile:", error);
        return { error: error.message };
    }


}
