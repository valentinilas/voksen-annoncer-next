// validation-schema-server.js
import * as Yup from 'yup';

export const createServerValidationSchema = (t) => Yup.object({
    newComment: Yup.string()
        .required(t('validation.required')),
});