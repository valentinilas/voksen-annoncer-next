
import SignUp from './sign-up-page';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata({ params, searchParams }) {
  const { locale } = await params;
  const t = await getTranslations();

  return {
    title: t("meta.signup.title"),
    description: t("meta.signup.description"),
    alternates: {
      canonical: `https://www.voksen-annoncer.com/${locale}/sign-up`,
      languages: {
        'en': `https://www.voksen-annoncer.com/en/sign-up`,
        'da': `https://www.voksen-annoncer.com/da/sign-up`,
        'x-default': `https://www.voksen-annoncer.com/da/sign-up`
      },
    },
  };
}

export default async function SignInWrapper({params}) {
    return <SignUp/>
}