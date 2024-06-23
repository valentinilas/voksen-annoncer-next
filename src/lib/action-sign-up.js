'use server';

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import { getTranslations } from 'next-intl/server';
import { createServerValidationSchema } from '@/app/[locale]/sign-up/validation-schema-server';




export async function signup(formData) {
    const supabase = createClient();
    const t = await getTranslations();
    const serverValidationSchema = createServerValidationSchema(t);

    const data = {
        username: formData.get('username'),
        email: formData.get('email'),
        password: formData.get('password'),
    };



    // Validate the data
    try {
        await serverValidationSchema.validate(data, { abortEarly: false });
    } catch (validationError) {
        console.error('Validation error:', validationError.errors);
        return { error: validationError.errors };
    }

    try {

        // If validation succeeds, proceed with signup
        const { error } = await supabase.auth.signUp({
            email: data.email,
            password: data.password,
            options: {
                data: {
                    username: data.username
                }
            }
        });

        if (error) {
            console.error('Authentication error:', error.message);
            return { error: [error.message] }
        }

    } catch (error) {
        console.error('Authentication error:', error.message);
        return { error: [error.message] }
    }

    revalidatePath('/', 'layout')
    redirect('/welcome');
}
