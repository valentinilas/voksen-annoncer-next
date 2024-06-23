// validation-schema.js
import * as Yup from 'yup';

export const createValidationSchema = (t) => {
    return Yup.object({
        username: Yup.string()
            .required(t("validation.username-required"))
            .min(3, t("validation.username-length"))
            .max(12, t("validation.username-length"))
            .matches(/^[a-zA-Z0-9]{3,12}$/, t("validation.username-symbols")),


        email: Yup.string()
            .required(t("validation.email-required"))
            .email(t("validation.email-invalid")),


        password: Yup.string()
            .required(t("validation.password-required"))
            .min(6, t("validation.password-length"))

    });
}

