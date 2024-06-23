import Button from '@/components/button/button';
import { useTranslations } from 'next-intl';

export function SubmitButton({ isSubmitting, isValid }) {
    const t = useTranslations();



    return <Button type="submit" className="mt-10 w-full justify-center"
        disabled={isSubmitting || !isValid}>
        {isSubmitting ?
            (<span className="loading loading-spinner loading-sm"></span>) : (t("auth.login"))
        }
    </Button>

}