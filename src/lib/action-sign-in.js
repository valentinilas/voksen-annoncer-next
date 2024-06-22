'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

import * as Yup from 'yup';
const loginSchema = Yup.object().shape({
    email: Yup.string().email().required(),
    password: Yup.string().min(6).required()
});

export async function login(prevState, formData) {

    const supabase = createClient()


    const data = {
        email: formData.get('email'),
        password: formData.get('password'),
    }

    try {
        await loginSchema.validate(data);
    } catch (validationError) {
        return { error: validationError.errors.join(', ') };
    }

    const { error } = await supabase.auth.signInWithPassword(data)

    if (error) {
        return { error: error.message };
    }

    revalidatePath('/', 'layout')
    redirect('/dashboard')
}

