"use client";

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { signup } from '@/lib/action-sign-up';
import { SubmitButton } from './submit-button';
import { useState } from 'react';
import { createValidationSchema } from './validation-schema';
import { useForm } from 'react-hook-form';
import { yupResolver } from "@hookform/resolvers/yup"




export default function SignUp() {

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
        formData.append('username', data.username);


        const response = await signup(formData);

        if (response?.error) {
            setServerValidationError({ error: response.error })
        } else {
            reset();
        }
    });


    // In your SignUp component

const handleGoogleSignUp = async () => {
  
    try {
      const response = await fetch('/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ provider: 'google' }),
      });
  
      const result = await response.json();
  
      if (response.ok) {
        // Handle successful login
        // e.g., redirect to a dashboard or home page
        window.location.href = '/dashboard'; // Example redirect
      } else {
        const errorArray = Array.isArray(result.error) ? result.error : [result.error];
        setServerValidationError({ error: errorArray });
      }
    } catch (error) {
        setServerValidationError({ error: ["Something went wrong, please try again."] });
    } 
  };
  





    return (
        <div className="mx-auto bg-base-100  p-5 rounded-box  sm:max-w-sm">
            <div className="sm:mx-auto sm:w-full sm:max-w-sm ">
                <h1 className="text-2xl font-bold mb-10 text-center ">{t("auth.sign-up")}</h1>
                <form onSubmit={onSubmit}>
                {serverValidationError.error && <div>{serverValidationError.error.map((error, index) => <p key={index} className="error text-red-500 text-sm mt-2">{error}</p>)}</div>}
                    <div className="mt-4">
                        <label htmlFor="username" className="block  text-sm font-bold mb-2">{t("auth.username")}</label>
                        <input
                            className="input input-bordered w-full"
                            type="text"
                            id="username"
                            name="username"
                            {...register("username")}
                            required
                        />
                       {errors?.username && <p className="error text-red-500 text-sm mt-2">{errors?.username?.message}</p>}
                    </div>
                    <div className="mt-4">
                        <label htmlFor="email" className="block  text-sm font-bold mb-2">{t("auth.email")}</label>
                        <input
                            className="input input-bordered w-full"
                            type="email"
                            id="email"
                            name="email"
                            {...register("email")}
                            required
                        />
                       {errors?.email && <p className="error text-red-500 text-sm mt-2">{errors?.email?.message}</p>}
                    </div>
                    <div className="mt-4">
                        <label htmlFor="password" className="block  text-sm font-bold mb-2">{t("auth.password")}</label>

                        <input
                            className="input input-bordered w-full"
                            type="password"
                            id="password"
                            name="password"
                            {...register("password")}
                            required
                        />
                       {errors?.password && <p className="error text-red-500 text-sm mt-2">{errors?.password?.message}</p>}
                    </div>

                  
                    <SubmitButton isSubmitting={isSubmitting} isValid={isValid} />
                </form>
                <div><button onClick={handleGoogleSignUp }>G</button></div>
                <p className="mt-10 text-center text-sm ">
                    <span className="mr-1">{t("auth.yes-account")}</span>
                    <Link href="/sign-in" className="font-semibold leading-6 text-cherry-600 hover:text-cherry-700">{t("auth.login")}</Link>
                </p>
            </div>
        </div>
    );
};




