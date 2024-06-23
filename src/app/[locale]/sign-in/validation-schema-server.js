// validation-schema-server.js
import * as Yup from 'yup';

export const createServerValidationSchema = (t) => Yup.object({
    email: Yup.string()
        .email(t("validation.email-invalid"))
        .required(t("validation.email-required")),
    password: Yup.string()
        .required(t("validation.password-required"))
});