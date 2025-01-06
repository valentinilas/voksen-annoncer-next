



import { fetchSingleArticle } from "@/lib/fetchSingleArticle";
import ReactMarkdown from 'react-markdown';
import { formatDate } from "@/utils/formatter/format-date";
import Image from "next/image";
import DefaultImage from "@/components/default-image/default-image";
import { getTranslations } from "next-intl/server";


import { cdnUrl } from "@/utils/imagekit/cdn-url";
import Link from "next/link";
import { routing } from '@/i18n/routing';
// import { setRequestLocale } from "next-intl/server";
import { apiFetchAllPublicArticles } from "@/utils/api/fetch-helpers";
import { apiFetchSingleArticle } from "@/utils/api/fetch-helpers";


// export const dynamic = 'force-static';
// export const revalidate = 3600;
// // This ensures all possible paths are generated at build time
// export async function generateStaticParams() {
//     try {
//         const { articles } = await apiFetchAllPublicArticles();
//         // console.log('Fetched Articles');
//         // Generate paths for each article in each locale
//         const paths = routing.locales.flatMap(locale =>
//             articles.map(article => ({
//                 locale,
//                 slug: article.Slug
//             }))
//         );


//         return paths;
//     } catch (error) {
//         console.error('Error generating static params:', error);
//         return [];
//     }
// }

export async function generateMetadata({ params }) {
    const { slug, locale } = await params;
    try {
        const { article } = await apiFetchSingleArticle(slug);
        // console.log('Fetched article:', article.Slug);
        return {
            metadataBase: new URL('https://www.voksen-annoncer.com'),
            title: article.Title + ' | Voksenannoncer',
            description: article.Summary,
            openGraph: {
                images: [article.Image?.url || ''],
            },
            alternates: {
                canonical: `https://www.voksen-annoncer.com/${locale}/articles/${slug}`,
                languages: {
                    'en': `https://www.voksen-annoncer.com/en/articles/${slug}`,
                    'da': `https://www.voksen-annoncer.com/da/articles/${slug}`
                },
            },

        };
    } catch (error) {
        console.error("Failed to fetch article data:", error);
        return {

        };
    }
}

const components = {
    h1: ({ node, ...props }) => <h1 className="text-3xl font-bold my-4" {...props} />,
    h2: ({ node, ...props }) => <h2 className="text-2xl font-semibold my-3" {...props} />,
    h3: ({ node, ...props }) => <h3 className="text-xl font-semibold my-2" {...props} />,
    p: ({ node, ...props }) => <p className="my-2" {...props} />,
    ul: ({ node, ...props }) => <ul className="list-disc list-inside my-2 pl-8" {...props} />,
    ol: ({ node, ...props }) => <ol className="list-decimal list-outside my-2 pl-8" {...props} />,
    li: ({ node, ...props }) => <li className="my-1" {...props} />,
};


export default async function Article({ params }) {
    const t = await getTranslations();

    const { slug } = await params;


    const { article } = await apiFetchSingleArticle(slug);


    if (!article) {
        return <>
            <article>
                <div className="bg-base-100 p-20 rounded-box shadow-sm">
                    <h1 className="text-4xl mb-5 text-center">Ikke fundet</h1>

                </div>

            </article>
        </>
    }

    const { id, Title, 'Body Text': BodyText, createdAt, Author, Summary, Image: articleImage } = article;
    // console.log(articleImage);

    return <>
        <article>

            <div className=" mx-auto bg-base-100 p-10 rounded-box">
  
                <h1 className="text-4xl mb-5 ">{Title}</h1>
                <p>{Summary}</p>
                {articleImage ?
                    <Image
                        src={cdnUrl(`https://cms.voksen-annoncer.com${articleImage?.url}`, 800, 800)}
                        alt={articleImage.alt}
                        width={articleImage.width}
                        height={articleImage.height}
                        className="rounded-lg mx-auto size-full my-10"
                    /> : <DefaultImage />}

                <ReactMarkdown className="prose prose-lg" components={components}>{BodyText}</ReactMarkdown>
                <p className="pt-10">{Author} | {formatDate(createdAt)} </p>
            </div>

            <div className=" mx-auto  px-2 py-3 ">
                    <Link href="/">{t("navigation.home")}</Link> / <Link href="/articles">{t("navigation.articles")}</Link> / <span>{Title}</span>
                </div>
        </article>
    </>
}
