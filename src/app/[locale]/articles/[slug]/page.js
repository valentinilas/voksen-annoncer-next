



import { fetchSingleArticle } from "@/lib/fetchSingleArticle";
import ReactMarkdown from 'react-markdown';
import { formatDate } from "@/utils/formatter/format-date";
import Image from "next/image";

import { cdnUrl } from "@/utils/imagekit/cdn-url";

export async function generateMetadata({params}) {
    const {slug, locale} = await params;

    try {
        const { article } = await fetchSingleArticle(slug);
        return {
            title: article.Title + ' | Voksenannoncer',
            description: article.Summary,
            openGraph: {
                images: [article.Image.url || ''],
            },
            alternates: {
                canonical: `https://voksen-annoncer.com/${locale}/articles/${slug}`,
                languages: {
                    'en': `https://voksen-annoncer.com/en/articles/${slug}`,
                    'da': `https://voksen-annoncer.com/da/articles/${slug}`
                },
            },

        };
    } catch (error) {
        console.error("Failed to fetch ad data:", error);
        return {
            title: "Gratis Voksenannoncer | Post Dine Annoncer på Vores Platform",
            description: "Udforsk og opret gratis voksenannoncer på vores  platform. Nem, hurtig og sikker måde at dele dine annoncer på. Start i dag og nå ud til flere!",
        };
    }
}

const components = {
    h1: ({node, ...props}) => <h1 className="text-3xl font-bold my-4" {...props} />,
    h2: ({node, ...props}) => <h2 className="text-2xl font-semibold my-3" {...props} />,
    p: ({node, ...props}) => <p className="my-2" {...props} />,
    ul: ({node, ...props}) => <ul className="list-disc list-inside my-2 pl-8" {...props} />,
    ol: ({node, ...props}) => <ol className="list-decimal list-outside my-2 pl-8" {...props} />,
    li: ({node, ...props}) => <li className="my-1" {...props} />,
  };


export default async function Article({params}) {
    const {Slug} = await params;



    const {article} = await fetchSingleArticle(Slug);

    console.log( article);

    if(!article){
        return <>
            <article>
                <div className="bg-base-100 p-20 rounded-box shadow-sm">
                    <h1 className="text-4xl mb-5 text-center">Ikke fundet</h1>

                </div>

            </article>
        </>
    }

    const { id, Title, 'Body Text': BodyText, createdAt, Author, Summary, Image:articleImage } = article;
    console.log(articleImage);

    return <>
        <article>
                <div className="max-w-4xl mx-auto bg-base-100 p-10 rounded-box">
                <h1 className="text-4xl mb-5 ">{Title}</h1>
               <p>{Summary}</p>
          
               <Image
                   src={cdnUrl(`https://cms.voksen-annoncer.com${articleImage?.url}`,800,800)}
                   alt={articleImage.alt}
                   width={articleImage.width}
                   height={articleImage.height}
                   layout="responsive"
                   className="rounded-lg mx-auto size-full my-10"
               />
               <ReactMarkdown className="prose prose-lg" components={components}>{BodyText}</ReactMarkdown>
               <p className="pt-10">{Author} | {formatDate(createdAt)} </p>
                </div>
               

        </article>
    </>
}
