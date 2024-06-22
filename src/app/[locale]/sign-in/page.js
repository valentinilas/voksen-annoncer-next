'use client';

import { login } from '@/lib/action-sign-in';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useTranslations } from 'next-intl';
import { useFormState } from 'react-dom';
import { SubmitButton } from './submit-button';

import Link from 'next/link';







export default function SignIn() {
  const t = useTranslations();

  const [state, formAction] = useFormState(login, { error: null });


  const validationSchema = Yup.object({
    email: Yup.string().email(`${t("validation.email-invalid")}`).required(`${t("validation.required")}`),
    password: Yup.string().required(`${t("validation.required")}`)
  });
  const formik = useFormik({
    initialValues: {
      email: '',
      password: ''
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
    }
  });



  return (
    <div className="mx-auto bg-base-200  p-5 rounded-box  sm:max-w-sm">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="text-2xl font-bold mb-10 text-center dark:text-zinc-400">{t("auth.login")}</h2>
        <form action={formAction} >
          {state.error && <p className="error text-red-500 text-sm">{state.error}</p>}

          <div className="mt-4">
            <label htmlFor="email" className="block  text-sm font-bold mb-2">Email:</label>
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
              {...formik.getFieldProps('password')}
              required
            />
            {formik.touched.password && formik.errors.password ? (
              <div className="text-red-500 text-sm mt-2">{formik.errors.password}</div>
            ) : null}
          </div>
          {/* <Button type="submit" className="mt-10 w-full justify-center" disabled={!formik.isValid || isSubmitting}>
            {isSubmitting ? 'Submitting...' : t("auth.login")}
          </Button> */}
          {/* <Button type="submit" className="mt-10 w-full justify-center" disabled={formik.isSubmitting}>{t("auth.login")}</Button>
           */}
           <SubmitButton/>
        </form>
        <p className="mt-10 text-center text-sm ">
          <span className="mr-1 ">{t("auth.no-account")}</span>
          <Link href="/sign-up" className="font-semibold leading-6 text-cherry-600 hover:text-cherry-700">{t("auth.sign-up")}</Link>
        </p>
      </div>
    </div>
  );
};
