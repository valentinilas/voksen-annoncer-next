'use client';

import { requestPasswordReset } from '@/lib/action-request-password-reset';
import { SubmitButton } from './submit-button';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from "@hookform/resolvers/yup"
import { createValidationSchema } from './validation-schema';
import { useTranslations } from 'next-intl';


export default function ResetPasswordRequest() {

  const [serverValidationError, setServerValidationError] = useState({ error: null });
  const [serverSuccess, setServerSuccess] = useState({ success: null });


  // Translations
  const t = useTranslations();

  const validationSchema = createValidationSchema(t);

  // React Hook Form
  const {
    handleSubmit,
    register,
    reset,
    formState: { errors, isSubmitting, isValid },
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(validationSchema)
  });


  const onSubmit = handleSubmit(async data => {

    const formData = new FormData();
    // Append text fields
    formData.append('email', data.email);


    const response = await requestPasswordReset(formData);

    if (response?.error) {
      setServerValidationError({ error: response.error })
      setServerSuccess({ success: null });

    } else {
      reset();
    }
    if (response?.success) {
      setServerValidationError({ error: null })
      setServerSuccess({ success: true });
      reset();
    }
  });

  return (
    <div className="mx-auto bg-base-200  p-5 rounded-box  sm:max-w-sm">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="text-2xl font-bold mb-10 text-center">{t("auth.reset-password")}</h2>
        <form onSubmit={onSubmit} >
          {serverValidationError.error && <div>{serverValidationError.error.map((error, index) => <p key={index} className="error text-red-500 text-sm mt-2 mb-2">{error}</p>)}</div>}
          {serverSuccess.success && <p className="text-green-500 text-sm mt-2 mb-2">{t("auth.password-reset-sent")}</p>}
          <div className="mt-4">
            <label htmlFor="repeatPassword" className="block  text-sm font-bold mb-2">{t("auth.email")}</label>

            <input
              type="email"
              name="email"
              required
              className="input input-bordered w-full"
              {...register("email")}
            />
            {errors?.email && <p className="error text-red-500 text-sm mt-2">{errors?.email?.message}</p>}
          </div>
          <SubmitButton isSubmitting={isSubmitting} isValid={isValid} />
        </form>

      </div>
    </div>
  );
}