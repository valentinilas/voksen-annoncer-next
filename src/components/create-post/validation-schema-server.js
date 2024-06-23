// validation-schema-server.js
import * as Yup from 'yup';

export const createServerValidationSchema = (t) => Yup.object({
    title: Yup.string()
        .required(t('validation.title-required'))
        .max(160, t('validation.title-length')),
    description: Yup.string()
        .required(t('validation.description-required')),
    region: Yup.string()
        .required(t('validation.region-required')),
    category: Yup.string()
        .required(t('validation.category-required')),
    subcategory: Yup.string()
        .required(t('validation.subcategory-required')),
    images: Yup.array()
        .of(Yup.mixed())
        .test('fileType', t('create-ad.image-type'), (value) => {
            if (!value || !value.length) return true;
            return value.every(file => file.type.startsWith('image/'));
        })
        .test('fileSize', t('create-ad.image-size'), (value) => {
            if (!value || !value.length) return true;
            return value.every(file => file.size <= 2 * 1024 * 1024);
        })

        .test('fileCount', t('create-ad.image-length'), (value) => {
            if (!value || !value.length) return true;
            return value.length <= 12;
        })
});