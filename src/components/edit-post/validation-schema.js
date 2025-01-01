// validation-schema.js
import * as Yup from 'yup';

export const createValidationSchema = (t) => {
    return Yup.object({
        title: Yup.string()
            .required(t('validation.required'))
            .max(160, t('validation.title-length')),
        description: Yup.string()
            .required(t('validation.required')),
        images: Yup.mixed()
            .test('fileType', t('create-ad.image-type'), (value) => {
                if (!value || !value.length) return true; // not required
                return Array.from(value).every(file => file.type.startsWith('image/'));
            })
            .test('fileSize', t('create-ad.image-size'), (value) => {
                if (!value || !value.length) return true; // not required
                return Array.from(value).every(file => file.size <= 2 * 1024 * 1024); // 2MB
            })
            .test('fileCount', t('create-ad.image-length'), (value) => {
                if (!value || !value.length) return true; // not required
                return value.length <= 12;
            }),
        region: Yup.string()
            .required(t('validation.required')),
        category: Yup.string()
            .required(t('validation.required')),
        subcategory: Yup.string()
            .required(t('validation.required')),
    });
}

