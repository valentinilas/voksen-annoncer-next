// validation-schema.js
import * as Yup from 'yup';

export const createValidationSchema = (t) => {
    return Yup.object({
        newComment: Yup.string()
            .required(t('validation.required')),
    });
}

