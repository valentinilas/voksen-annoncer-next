// validation-schema-server.js
import * as Yup from 'yup';

export const createAvatarServerValidationSchema = (t) => Yup.object({
    image: Yup.mixed()
        .test('fileType', t('create-ad.image-type'), (file) => {
            if (!file) return true; // not required
            return file.type.startsWith('image/');
        })
        .test('fileSize', t('create-ad.image-size'), (file) => {
            if (!file) return true; // not required
            return file.size <= 2 * 1024 * 1024; // 2MB
        })
        .test('fileCount', t('create-ad.image-length'), (file) => {
            if (!file) return true; // not required
            return true; // Single file check
        }),
});