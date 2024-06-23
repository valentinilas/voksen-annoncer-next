// validation-schema.js
import * as Yup from 'yup';

export const createValidationSchema = (t) => {
    return Yup.object({
        email: Yup.string()
            .email(`${t("validation.email-invalid")}`)
            .required(`${t("validation.required")}`),
        password: Yup.string()
            .required(`${t("validation.required")}`)
    });
}

