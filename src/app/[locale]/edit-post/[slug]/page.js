

import { EditPostWrapper } from '@/components/edit-post/edit-post-wrapper';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata({ params, searchParams }, parent) {
    const t = await getTranslations();
    const { locale } = await params

    return {
        title: `${t("ads.edit-ad")} | ${t("navigation.site-name")}`,
        alternates: {
            canonical: `https://www.voksen-annoncer.com/${locale}/edit-post`,
            languages: {
                'en': `https://www.voksen-annoncer.com/en/edit-post`,
                'da': `https://www.voksen-annoncer.com/da/edit-post`,
                'x-default': `https://www.voksen-annoncer.com/da/edit-post`
            },
        },
    };

}

export default async function NewPost({params}) {
    const {slug} = await params;
    return <EditPostWrapper slug={slug}/>
}