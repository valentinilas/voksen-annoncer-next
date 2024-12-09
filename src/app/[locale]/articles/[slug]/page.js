



import { fetchSingleArticle } from "@/lib/fetchSingleArticle";
import ReactMarkdown from 'react-markdown';
import { formatDate } from "@/utils/formatter/format-date";
import Image from "next/image";

export async function generateMetadata({params}) {
    const {slug, locale} = await params;

    try {
        const { article } = await fetchSingleArticle(slug);
        return {
            title: article.title + ' | Voksenannoncer',
            description: article.summary,
            openGraph: {
                images: [article.summary_image || ''],
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
    const {slug} = await params;


    const [articleData] = await Promise.all([
        fetchSingleArticle(slug),
    ]);

    const { article } = articleData;
    const {username} = article.profiles;


    if(!article){
        return <>
            <article>
                <div className="bg-base-100 p-20 rounded-box shadow-sm">
                    <h1 className="text-4xl mb-5 text-center">Ikke fundet</h1>

                </div>

            </article>
        </>
    }

    const { id, title, body, created_at, author, summary, summary_image, summary_image_width, summary_image_height } = article;


    return <>
        <article>
                <div className="max-w-4xl mx-auto bg-base-100 p-10 rounded-box">
                <h1 className="text-4xl mb-5 ">{title}</h1>
               <p>{summary}</p>
          
               <Image
                   src={summary_image}
                   alt={title}
                   width={summary_image_width}
                   height={summary_image_height}
                   // layout="responsive"
                   className="rounded-lg mx-auto size-full my-10"
               />
               <ReactMarkdown className="prose prose-lg" components={components}>{body}</ReactMarkdown>
               <p className="pt-10">{username} | {formatDate(created_at)} </p>
                </div>
               

        </article>
    </>
}
