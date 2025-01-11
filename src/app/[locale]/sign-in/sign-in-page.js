'use client';

import { login } from '@/lib/action-sign-in';
import { useTranslations } from 'next-intl';
import { SubmitButton } from './submit-button';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from "@hookform/resolvers/yup"
import { createValidationSchema } from './validation-schema';
import Link from 'next/link';




export default function SignIn() {
  const [serverValidationError, setServerValidationError] = useState({ error: null });


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
    formData.append('password', data.password);


    const response = await login(formData);

    if (response?.error) {
      setServerValidationError({ error: response.error })
    } else {
      reset();
    }
  });


  return (
    <div className="mx-auto bg-base-100  p-5 rounded-box  sm:max-w-sm">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h1 className="text-2xl font-bold mb-10 text-center">{t("auth.login")}</h1>
        <form onSubmit={onSubmit} >
          {serverValidationError.error && <div>{serverValidationError.error.map((error, index) => <p key={index} className="error text-red-500 text-sm mt-2">{error}</p>)}</div>}

          <div className="mt-4">
            <label htmlFor="email" className="block  text-sm font-bold mb-2">Email:</label>
            <input
              className="input input-bordered w-full"
              type="email"
              id="email"
              name="email"
              required
              {...register("email")}

            />
            {errors?.email && <p className="error text-red-500 text-sm mt-2">{errors?.email?.message}</p>}

          </div>
          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <label htmlFor="password" className="block  text-sm font-bold mb-2">{t("auth.password")}</label>
              <div className="text-sm">
                <Link href="/password-reset" className="font-semibold text-cherry-600 hover:text-cherry-700">{t("auth.forgot-password")}</Link>
              </div>
            </div>
            <input
              className="input input-bordered w-full"
              type="password"
              id="password"
              name="password"
              required
              {...register("password")}

            />
            {errors?.password && <p className="error text-red-500 text-sm mt-2">{errors?.password?.message}</p>}

          </div>
          <SubmitButton isSubmitting={isSubmitting} isValid={isValid} />
        </form>
        <p className="mt-10 text-center text-sm ">
          <span className="mr-1 ">{t("auth.no-account")}</span>
          <Link href="/sign-up" className="font-semibold leading-6 text-cherry-600 hover:text-cherry-700">{t("auth.sign-up")}</Link>
        </p>
      </div>
    </div>
  );
};
