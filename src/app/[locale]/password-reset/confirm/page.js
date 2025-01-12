
import ResetPasswordConfirm from './confirm-page';

import { getTranslations } from 'next-intl/server';
import { generateAlternatesBlock } from '@/utils/generate-canonical/generateAlternatesBlock';

export async function generateMetadata({ params, searchParams }, parent) {
  const t = await getTranslations();
  const { locale } = await params

  return {
      title: `${t("validation.password-set-new")} | ${t("navigation.site-name")}`,
      alternates: generateAlternatesBlock(locale, '/password-reset/confirm', await searchParams)
  };

}

export default async function ResetPasswordConfirmWrapper({params}) {
    return <ResetPasswordConfirm/>
}