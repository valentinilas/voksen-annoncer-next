'use server';

import { createClient } from '@/utils/supabase/server'

export async function confirmPasswordReset(prevState, formData) {
    const supabase = createClient();
    const password = formData.get('password');
    const token = formData.get('token_hash');
  
    if (!token) {
      return { error: 'Invalid or missing reset token' };
    }
  
    const { error } = await supabase.auth.updateUser({ password });
  
    if (error) {
      return { error: error.message };
    }
  
    return { success: true };
  }