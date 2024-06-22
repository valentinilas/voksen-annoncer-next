'use server';

import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import * as Yup from 'yup';

const signupSchema = Yup.object().shape({
    username: Yup.string()
        .matches(/^[a-zA-Z0-9]{3,12}$/, 'Username must be alphanumeric and between 3 to 12 characters')
        .required('Username is required'),
    email: Yup.string()
        .email('Invalid email address')
        .required('Email is required'),
    password: Yup.string()
        .min(6, 'Password must be at least 6 characters')
        .required('Password is required')
});

export async function signup(formData) {
    const supabase = createClient();

    const data = {
        username: formData.get('username'),
        email: formData.get('email'),
        password: formData.get('password'),
    };

    try {
        // Validate form data against signupSchema
        await signupSchema.validate(data);

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
            console.error('Supabase error:', error.message);
            redirect(`/error?message=${encodeURIComponent(error.message)}`);
        }

        redirect('/account');
    } catch (error) {
        if (error instanceof Yup.ValidationError) {
            return redirect('/error?message=' + encodeURIComponent(error.message));
        }
        // If it's not a validation error, it's likely a redirect
        throw error;
    }
}
