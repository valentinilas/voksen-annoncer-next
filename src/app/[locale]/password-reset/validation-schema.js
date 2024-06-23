// validation-schema.js
import * as Yup from 'yup';

export const createValidationSchema = (t) => {
    return Yup.object({
        email: Yup.string()
            .required(t("validation.email-required"))
            .email(t("validation.email-invalid"))

    });
}

