// validation-schema.js
import * as Yup from 'yup';

const phone_pattern = /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/;

export const createProfileValidationSchema = (t) => {
    return Yup.object({
        // OK
        username: Yup.string()
            .required(t("validation.username-required"))
            .min(3, t("validation.username-length"))
            .max(12, t("validation.username-length"))
            .matches(/^[a-zA-Z0-9]{3,12}$/, t("validation.username-symbols")),

        // OK
        birthday: Yup.date()
            .required(t("validation.required")),
        // OK
        bio: Yup.string()
            .max(160, t("validation.bio-length")),
        // OK
        region_id: Yup.string()
            .required(t('validation.required')),
        // OK
        gender_id: Yup.string()
            .required(t('validation.required')),

        // OK
        contact_email: Yup.string()
            .nullable()
            .notRequired()
            .email(t("validation.email-invalid")),
        // OK
        contact_phone: Yup.string()
            .nullable()
            .notRequired()
            .max(12, t("validation.phone-invalid"))
            .test('is-valid-phone', t("validation.phone-invalid"), value => {
                return !value || phone_pattern.test(value);
            }),
        contact_sms: Yup.string()
            .nullable()
            .notRequired()
            .max(12, t("validation.phone-invalid"))
            .test('is-valid-sms', t("validation.phone-invalid"), value => {
                return !value || phone_pattern.test(value);
            }),

        // Optional
        email_visible: Yup.boolean()
            .required(t('validation.required')),
        phone_visible: Yup.boolean()
            .required(t('validation.required')),
        sms_visible: Yup.boolean()
            .required(t('validation.required')),

    });
}


