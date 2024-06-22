import { useFormStatus } from 'react-dom';
import Button from '@/components/button/button';
import { useTranslations } from 'next-intl';

export function SubmitButton() {
    const t = useTranslations();

    const { pending } = useFormStatus();

    return <Button type="submit" className="mt-10 w-full justify-center" disabled={pending}>{pending ? <span className="loading loading-dots loading-sm"></span> : t("auth.sign-up")}</Button>

}