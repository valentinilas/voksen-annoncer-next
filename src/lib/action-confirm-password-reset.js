'use server';

import { createClient } from '@/utils/supabase/server'

export async function confirmPasswordReset(prevState, formData) {
    const supabase = createClient();
    const password = formData.get('password');
    const code = formData.get('code');
  
    if (!code) {
      return { error: 'Invalid or missing reset token' };
    }
    supabase.auth.exchangeCodeForSession(code);



    const { error } = await supabase.auth.updateUser({ password });
  
    if (error) {
      return { error: error.message };
    }
  
    return { success: true };
  }