
import ResetPasswordRequest from './password-reset-page';

import { getTranslations } from 'next-intl/server';
import { generateAlternatesBlock } from '@/utils/generate-canonical/generateAlternatesBlock';

export async function generateMetadata({ params, searchParams }, parent) {
  const t = await getTranslations();
  const { locale } = await params

  return {
      title: `${t("auth.reset-password")} | ${t("navigation.site-name")}`,
      description: t('auth.reset-password-description'),
      alternates: generateAlternatesBlock(locale, '/password-reset', await searchParams)
  };

}

export default async function ResetPasswordRequestWrapper({params}) {
    return <ResetPasswordRequest/>
}