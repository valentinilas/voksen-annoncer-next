
import { generateAlternatesBlock } from '@/utils/generate-canonical/generateAlternatesBlock';
import SignIn from './sign-in-page';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata({ params, searchParams }) {
  const { locale } = await params;
  const t = await getTranslations();

  return {
    title: t("meta.login.title"),
    description: t("meta.login.description"),
    
    alternates: generateAlternatesBlock(locale, '/sign-in', await searchParams)
  };
}

export default async function SignInWrapper({params}) {
    return <SignIn/>
}