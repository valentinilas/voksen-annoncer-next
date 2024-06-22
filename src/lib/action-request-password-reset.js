'use server';

import { createClient } from '@/utils/supabase/server'

export async function requestPasswordReset(prevState, formData) {
    const supabase = createClient();
    const email = formData.get('email');

    if (!email) {
        return { error: 'Email is required' };
    }

    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/password-reset/confirm`,
    });

    if (error) {
        console.error('Password reset error:', error);
        return { error: error.message };
    }

    return { success: true };
}