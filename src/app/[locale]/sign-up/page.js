
import { generateAlternatesBlock } from '@/utils/generate-canonical/generateAlternatesBlock';
import SignUp from './sign-up-page';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata({ params, searchParams }) {
  const { locale } = await params;
  const t = await getTranslations();

  return {
    title: t("meta.signup.title"),
    description: t("meta.signup.description"),
  
    alternates: generateAlternatesBlock(locale, '/sign-up', await searchParams)
  };
}

export default async function SignInWrapper({params}) {
    return <SignUp/>
}