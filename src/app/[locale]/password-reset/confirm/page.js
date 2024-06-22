'use client';

import { useFormState } from 'react-dom';
import { useSearchParams } from 'next/navigation';
import { confirmPasswordReset } from '@/lib/action-confirm-password-reset';
import { SubmitButton } from '../submit-button';

import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useTranslations } from 'next-intl';

const initialState = { error: null, success: false };

export default function ResetPasswordConfirm() {
  const t = useTranslations();

  const searchParams = useSearchParams();
  const [state, formAction] = useFormState(confirmPasswordReset, initialState);

  const validationSchema = Yup.object({
    password: Yup.string().required(`${t("validation.required")}`)
  });
  const formik = useFormik({
    initialValues: {
      password: '',
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
    }
  });


  return (
    <div className="mx-auto bg-base-200  p-5 rounded-box  sm:max-w-sm">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="text-2xl font-bold mb-4">{t("auth.set-new-password")}</h2>
        <form action={formAction}>
          <input type="hidden" name="code" value={searchParams.get('code') || ''} />
          <input
            type="password"
            name="password"
            placeholder={t("auth.new-password")}
            required
            className="input input-bordered w-full"
            {...formik.getFieldProps('password')}
          />
          {formik.touched.password && formik.errors.password ? (
            <div className="text-red-500 text-sm mt-2">{formik.errors.password}</div>
          ) : null}
          <SubmitButton />
        </form>
        {state.error && <p className="text-red-500 mt-2">{state.error}</p>}
        {state.success && <p className="text-green-500 mt-2">Password has been reset successfully.</p>}
      </div>
    </div>
  );
}