

import { CreatePostWrapper } from "@/components/create-post/create-post-wrapper"
import { getTranslations } from 'next-intl/server';

export async function generateMetadata({ params, searchParams }, parent) {
    const t = await getTranslations();
    const { locale } = await params

    return {
        title: `${t("navigation.create-ad")} | ${t("navigation.site-name")}`,
        alternates: {
            canonical: `https://www.voksen-annoncer.com/${locale}/new-post`,
            languages: {
                'en': `https://www.voksen-annoncer.com/en/new-post`,
                'da': `https://www.voksen-annoncer.com/da/new-post`,
                'x-default': `https://www.voksen-annoncer.com/da/new-post`,
            },
        },
    };

}

export default async function NewPost() {
    return <CreatePostWrapper/>
}