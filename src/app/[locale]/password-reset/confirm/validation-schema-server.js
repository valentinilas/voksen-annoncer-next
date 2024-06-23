// validation-schema-server.js
import * as Yup from 'yup';

export const createServerValidationSchema = (t) => Yup.object({
    password: Yup.string()
        .required(t("validation.password-required"))
        .min(6, t("validation.password-length"))
});