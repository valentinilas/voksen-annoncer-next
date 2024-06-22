"use client";

import { useFormik } from 'formik';
import * as Yup from 'yup';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { signup } from '@/lib/action-sign-up';
import { useFormState } from 'react-dom';
import { SubmitButton } from './submit-button';





export default function SignUp() {
    const [state, formAction] = useFormState(signup, { error: null });

    const t = useTranslations();

    // Define the validation schema
    const validationSchema = Yup.object({
        username: Yup.string()
            .min(3, `${t("validation.username-length")}`)
            .max(12, `${t("validation.username-length")}`)
            .matches(/^[a-zA-Z0-9]{3,12}$/, `${t("validation.username-symbols")}`)
            .required(`${t("validation.required")}`),

        email: Yup.string()
            .email(`${t("validation.email-invalid")}`)
            .required(`${t("validation.required")}`),

        password: Yup.string()
            .min(6, `${t("validation.password-length")}`)
            .required(`${t("validation.password-required")}`)
    });
    const formik = useFormik({
        initialValues: {
            username: '',
            email: '',
            password: ''
        },
        validationSchema: validationSchema,
        onSubmit: async (values) => {
        }
    });

    return (


        <div className="mx-auto bg-base-200  p-5 rounded-box  sm:max-w-sm">
            <div className="sm:mx-auto sm:w-full sm:max-w-sm ">
                <h2 className="text-2xl font-bold mb-10 text-center dark:text-zinc-400">{t("auth.sign-up")}</h2>
                <form action={formAction}>
                    {state.error && <p className="error text-red-500 text-sm">{state.error}</p>}
                    <div className="mt-4">
                        <label htmlFor="username" className="block  text-sm font-bold mb-2">{t("auth.username")}</label>
                        <input
                            className="input input-bordered w-full"
                            type="text"
                            id="username"
                            name="username"
                            {...formik.getFieldProps('username')}
                            required
                        />
                        {formik.touched.username && formik.errors.username ? (
                            <div className="text-red-500 text-sm mt-2">{formik.errors.username}</div>
                        ) : null}
                    </div>
                    <div className="mt-4">
                        <label htmlFor="email" className="block  text-sm font-bold mb-2">{t("auth.email")}</label>
                        <input
                            className="input input-bordered w-full"
                            type="email"
                            id="email"
                            name="email"
                            {...formik.getFieldProps('email')}
                            required
                        />
                        {formik.touched.email && formik.errors.email ? (
                            <div className="text-red-500 text-sm mt-2">{formik.errors.email}</div>
                        ) : null}
                    </div>
                    <div className="mt-4">
                        <label htmlFor="password" className="block  text-sm font-bold mb-2">{t("auth.password")}</label>

                        <input
                            className="input input-bordered w-full"
                            type="password"
                            id="password"
                            name="password"
                            {...formik.getFieldProps('password')}
                            required
                        />
                        {formik.touched.password && formik.errors.password ? (
                            <div className="text-red-500 text-sm mt-2">{formik.errors.password}</div>
                        ) : null}
                    </div>

                    {/* <button
                        type="submit"
                        disabled={formik.isSubmitting}
                        className="cursor-pointer rounded-full font-medium	 flex gap-2 justify-items-center items-center transition-colors border-2 disabled:opacity-50 disabled:cursor-not-allowed px-5 py-2 text-base bg-cherry-600 border-transparent  text-white hover:bg-cherry-500 w-full text-center justify-center mt-6">{t("auth.sign-up")}</button> */}
                    <SubmitButton />
                </form>
                <p className="mt-10 text-center text-sm ">
                    <span className="mr-1">{t("auth.yes-account")}</span>
                    <Link href="/sign-in" className="font-semibold leading-6 text-cherry-600 hover:text-cherry-700">{t("auth.login")}</Link>
                </p>
            </div>
        </div>
    );
};




