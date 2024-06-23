// validation-schema.js
import * as Yup from 'yup';

export const createValidationSchema = (t) => {
    return Yup.object({
        password: Yup.string()
            .required(t("validation.password-required"))
            .min(6, t("validation.password-length")),
        repeatPassword: Yup.string()
            .oneOf([Yup.ref('password'), null], t('validation.password-must-match'))
            .required(t('validation.password-required')),
        code: Yup.string().required(t('validation.code-required')),

    });
}

