// validation-schema.js
import * as Yup from 'yup';

export const createValidationSchema = (t) => {
    return Yup.object({
        email: Yup.string()
            .required(`${t("validation.required")}`)
            .email(`${t("validation.email-invalid")}`),

        password: Yup.string()
            .required(`${t("validation.required")}`)
    });
}

