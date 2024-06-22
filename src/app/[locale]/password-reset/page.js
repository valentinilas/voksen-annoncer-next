'use client';

import { useFormState } from 'react-dom';
import { requestPasswordReset } from '@/lib/action-request-password-reset';
import { SubmitButton } from './submit-button';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useTranslations } from 'next-intl';

const initialState = { error: null, success: false };

export default function ResetPasswordRequest() {
  const t = useTranslations();

  const [state, formAction] = useFormState(requestPasswordReset, initialState);

  const validationSchema = Yup.object({
    email: Yup.string().email(`${t("validation.email-invalid")}`).required(`${t("validation.required")}`)
  });
  const formik = useFormik({
    initialValues: {
      email: '',
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
    }
  });

  return (
    <div className="mx-auto bg-base-200  p-5 rounded-box  sm:max-w-sm">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="text-2xl font-bold mb-10 text-center">{t("auth.reset-password")}</h2>
        <form action={formAction}>
          <input
            type="email"
            name="email"
            placeholder="E-mail"
            required
            className="input input-bordered w-full"
            {...formik.getFieldProps('email')}
          />
          {formik.touched.email && formik.errors.email ? (
              <div className="text-red-500 text-sm mt-2">{formik.errors.email}</div>
            ) : null}
          <SubmitButton />
        </form>
        {state.error && <p className="text-red-500 mt-2">{state.error}</p>}
        {state.success && <p className="text-green-500 mt-2">{t("auth.password-reset-sent")}</p>}
      </div>
    </div>
  );
}