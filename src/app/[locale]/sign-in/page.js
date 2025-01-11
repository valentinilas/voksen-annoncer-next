
import SignIn from './sign-in-page';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata({ params, searchParams }) {
  const { locale } = await params;
  const t = await getTranslations();

  return {
    title: t("meta.login.title"),
    description: t("meta.login.description"),
    alternates: {
      canonical: `https://www.voksen-annoncer.com/${locale}/sign-in`,
      languages: {
        'en': `https://www.voksen-annoncer.com/en/sign-in`,
        'da': `https://www.voksen-annoncer.com/da/sign-in`
      },
    },
  };
}

export default async function SignInWrapper({params}) {
    return <SignIn/>
}