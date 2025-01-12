

import { CreatePostWrapper } from "@/components/create-post/create-post-wrapper"
import { generateAlternatesBlock } from "@/utils/generate-canonical/generateAlternatesBlock";
import { getTranslations } from 'next-intl/server';

export async function generateMetadata({ params, searchParams }, parent) {
    const t = await getTranslations();
    const { locale } = await params

    return {
        title: `${t("navigation.create-ad")} | ${t("navigation.site-name")}`,
        alternates: generateAlternatesBlock(locale, '/new-post', await searchParams)
    };

}

export default async function NewPost() {
    return <CreatePostWrapper/>
}