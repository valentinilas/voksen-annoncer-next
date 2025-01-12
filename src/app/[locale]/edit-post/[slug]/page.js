

import { EditPostWrapper } from '@/components/edit-post/edit-post-wrapper';
import { generateAlternatesBlock } from '@/utils/generate-canonical/generateAlternatesBlock';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata({ params, searchParams }, parent) {
    const t = await getTranslations();
    const { locale } = await params

    return {
        title: `${t("ads.edit-ad")} | ${t("navigation.site-name")}`,
        alternates: generateAlternatesBlock(locale, '/edit-post', await searchParams)
    };

}

export default async function NewPost({params}) {
    const {slug} = await params;
    return <EditPostWrapper slug={slug}/>
}