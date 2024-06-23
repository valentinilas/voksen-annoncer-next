'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { createServerValidationSchema } from '@/app/[locale]/sign-in/validation-schema-server'
import { getTranslations } from 'next-intl/server';

export async function login(formData) {
    const supabase = createClient()
    const t = await getTranslations();
    const serverValidationSchema = createServerValidationSchema(t);

    const data = {
        email: formData.get('email'),
        password: formData.get('password'),
    }

    // Validate the data
    try {
        await serverValidationSchema.validate(data, { abortEarly: false });
    } catch (validationError) {
        console.error('Validation error:', validationError.errors);
        return { error: validationError.errors };
    }

    // Attempt to sign in
    const { error } = await supabase.auth.signInWithPassword(data)

    if (error) {
        console.error('Authentication error:', error.message);
        return { error: [error.message] }; // Return as array for consistency with validation errors
    }

    revalidatePath('/', 'layout')
    redirect('/dashboard')
}