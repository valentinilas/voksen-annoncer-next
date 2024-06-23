// validation-schema-server.js
import * as Yup from 'yup';

export const createServerValidationSchema = (t) => Yup.object({
    email: Yup.string()
        .required(t("validation.email-required"))
        .email(t("validation.email-invalid"))
});