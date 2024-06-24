// validation-schema.js
import * as Yup from 'yup';

export const createAvatarValidationSchema = (t) => {
    return Yup.object({
        image: Yup.mixed()
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
                return value.length === 1;
            }),
    });
}