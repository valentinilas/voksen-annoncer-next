'use server';

import { createClient } from '@/utils/supabase/server'
import { createServerValidationSchema } from '@/app/[locale]/password-reset/confirm/validation-schema-server';
import { getTranslations } from 'next-intl/server';

export async function confirmPasswordReset(formData) {
  const supabase = createClient();
  const t = await getTranslations();
  const serverValidationSchema = createServerValidationSchema(t);

  const data = {
    password: formData.get('password'),
    repeatPassword: formData.get('repeatPassword'),
    code: formData.get('code'),
  }

  // Validate the data
  try {
    await serverValidationSchema.validate(data, { abortEarly: false });
  } catch (validationError) {
    console.error('Validation error:', validationError.errors);
    return { error: validationError.errors };
  }


  const { error: tokenExchangeError } = await supabase.auth.exchangeCodeForSession(data.code)

  if (tokenExchangeError) {
    return { error: [tokenExchangeError.message] };
  }


  const { error } = await supabase.auth.updateUser({ password:data.password });

  if (error) {
    return { error: [error.message] };
  }

  return { success: true };
}