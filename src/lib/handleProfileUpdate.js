'use server';
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { createProfileServerValidationSchema } from "@/components/dashboard/profile-validation-schema-server";
import { getTranslations } from "next-intl/server";

export const handleProfileUpdate = async (formData, profileId) => {

    const supabase = createClient();
    const t = await getTranslations();
    const serverValidationSchema = createProfileServerValidationSchema(t);

    const newData = Object.fromEntries(formData.entries())
    
    if (newData.birthday) {
        // Create a date object
        const date = new Date(newData.birthday);
        // Adjust for the timezone offset
        date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
        // Convert to ISO string
        newData.birthday = date.toISOString().split('T')[0];
    }

    console.log(newData);

    // Validate the data
    try {
       await serverValidationSchema.validate(newData, { abortEarly: false });
   
    } catch (validationError) {
        console.error('Validation error:', validationError.errors);
        return { error: validationError.errors };
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