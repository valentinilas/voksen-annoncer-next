'use server';

import { createClient } from '@/utils/supabase/server'
import { createServerValidationSchema } from '@/app/[locale]/password-reset/validation-schema-server';
import { getTranslations } from 'next-intl/server';

export async function requestPasswordReset(formData) {
    const supabase = createClient()
    const t = await getTranslations();
    const serverValidationSchema = createServerValidationSchema(t);

    const data = {
        email: formData.get('email'),
    }


    // Validate the data
    try {
        await serverValidationSchema.validate(data, { abortEarly: false });
    } catch (validationError) {
        console.error('Validation error:', validationError.errors);
        return { error: validationError.errors };
    }

    const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
        redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/password-reset/confirm`,
    });

    if (error) {
        console.error('Password reset error:', error);
        return { error: [error.message] };
    }

    return { success: true };
}