

import { CreatePostWrapper } from "@/components/create-post/create-post-wrapper"
import { getTranslations } from 'next-intl/server';

export async function generateMetadata({ params, searchParams }, parent) {
    const t = await getTranslations();

    return {
        title: `${t("navigation.create-ad")} | ${t("navigation.site-name")}`,
    };

}

export default async function NewPost() {
    return <CreatePostWrapper/>
}