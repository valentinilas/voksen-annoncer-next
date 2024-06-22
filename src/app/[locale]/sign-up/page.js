"use client";

import { useFormik } from 'formik';
import * as Yup from 'yup';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { signup } from '@/lib/action-sign-up';
import { useRef } from 'react';

// Define the validation schema
const validationSchema = Yup.object({
    username: Yup.string()
        .matches(/^[a-zA-Z0-9]{3,12}$/, 'Username must be alphanumeric and between 3 to 12 characters')
        .required('Required'),
    email: Yup.string()
        .email('Invalid email address')
        .required('Required'),
    password: Yup.string()
        .min(6, 'Password must be at least 6 characters')
        .required('Required')
});


export default function SignUp() {
    const t = useTranslations();
    const form = useRef();
    const formik = useFormik({
        initialValues: {
            username: '',
            email: '',
            password: ''
        },
        validationSchema: validationSchema,
        onSubmit: async (values, { setSubmitting }) => {
            setSubmitting(true); // Start the submission process
            try {
                const formData = new FormData(form.current);
                await signup(formData);
            } finally {
                setSubmitting(false); // End the submission process
            }
        }
    });

    return (


        <div className="mx-auto bg-base-200  p-5 rounded-box  sm:max-w-sm">
            <div className="sm:mx-auto sm:w-full sm:max-w-sm ">
                <h2 className="text-2xl font-bold mb-10 text-center dark:text-zinc-400">{t("auth.sign-up")}</h2>
                <form ref={form} onSubmit={formik.handleSubmit}>
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

                    <button
                        type="submit"
                        disabled={formik.isSubmitting}
                        className="cursor-pointer rounded-full font-medium	 flex gap-2 justify-items-center items-center transition-colors border-2 disabled:opacity-50 disabled:cursor-not-allowed px-5 py-2 text-base bg-cherry-600 border-transparent  text-white hover:bg-cherry-500 w-full text-center justify-center mt-6">{t("auth.sign-up")}</button>
                </form>
                <p className="mt-10 text-center text-sm ">
                    <span className="mr-1">{t("auth.yes-account")}</span>
                    <Link href="/sign-in" className="font-semibold leading-6 text-cherry-600 hover:text-cherry-700">{t("auth.login")}</Link>
                </p>
            </div>
        </div>
    );
};




