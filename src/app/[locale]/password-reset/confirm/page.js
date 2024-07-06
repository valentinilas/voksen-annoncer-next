'use client';

import { useSearchParams } from 'next/navigation';
import { confirmPasswordReset } from '@/lib/action-confirm-password-reset';
import { SubmitButton } from '../submit-button';
import { createValidationSchema } from './validation-schema';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { yupResolver } from "@hookform/resolvers/yup"


export default function ResetPasswordConfirm() {

  const searchParams = useSearchParams();

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
    formData.append('password', data.password);
    formData.append('repeatPassword', data.repeatPassword);
    formData.append('code', data.code);


    const response = await confirmPasswordReset(formData);

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
    <div className="mx-auto bg-base-100  p-5 rounded-box  sm:max-w-sm">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="text-2xl font-bold mb-4">{t("auth.set-new-password")}</h2>
        <form onSubmit={onSubmit} >
          {serverValidationError.error && <div>{serverValidationError.error.map((error, index) => <p key={index} className="error text-red-500 text-sm mt-2 mb-2">{error}</p>)}</div>}
          {serverSuccess.success && <p className="text-green-500 text-sm mt-2 mb-2">{t("auth.password-success-change")}</p>}

          {!serverSuccess.success && (<>
            <input
              type="hidden"
              name="code"
              value={searchParams.get('code') || ''}
              {...register("code")}
            />

            <div className="mt-4" >
              <label htmlFor="password" className="block  text-sm font-bold mb-2">{t("auth.password")}</label>

              <input
                type="password"
                name="password"
                required
                className="input input-bordered w-full"
                {...register("password")}
              />
              {errors?.password && <p className="error text-red-500 text-sm mt-2">{errors?.password?.message}</p>}
            </div>
            <div className="mt-4" >
              <label htmlFor="repeatPassword" className="block  text-sm font-bold mb-2">{t("auth.repeat-password")}</label>
              <input
                type="password"
                name="repeatPassword"
                required
                className="input input-bordered w-full "
                {...register("repeatPassword")}
              />
              {errors?.repeatPassword && <p className="error text-red-500 text-sm mt-2">{errors?.repeatPassword?.message}</p>}
            </div>
            <SubmitButton isSubmitting={isSubmitting} isValid={isValid} />
          </>)}
        </form>

      </div>
    </div>
  );
}