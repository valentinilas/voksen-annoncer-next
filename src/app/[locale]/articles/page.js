
import { fetchAllArticles } from "@/lib/fetchAllArticles";
import { formatDate } from "@/utils/formatter/format-date";
import Image from "next/image";
import Link from "next/link";

export async function generateMetadata({ params, searchParams }, parent) {

    return {
        title: "Artikler | Voksenannoncer.com",
        description: "Udforsk indsigtsfulde og engagerende blogindlæg om sex og seksualitet. Find artikler, der dækker et bredt udvalg af emner, herunder seksuel sundhed, forhold, intimitet og meget mere, alt sammen med det formål at fremme forståelse og sunde diskussioner.",
    };
}




export default async function Article({ params }) {


    const {articles} = await fetchAllArticles();



    if (!articles || articles.length === 0) {
        return <>
            <article>
                <div className="bg-base-100 p-20 rounded-box shadow-sm">
                    <h1 className="text-4xl mb-5 text-center">Ikke fundet</h1>
                </div>
            </article>
        </>
    }



    return <>
        <h1 class="text-2xl mb-5">Artikler</h1>
       <div className="grid grid-cols-1 md:grid-cols-3 gap-10">

        {articles.map(article=>{
            return <Link  href={`/articles/${article.slug}`} key={article.id} className="article-card">
                <div className="relative overflow-hidden bg-cover bg-no-repeat rounded-box mb-5">
                <Image src={article.summary_image} alt={article.title} width={600} height={600} />
                <div class="absolute bottom-0 left-0 right-0 top-0 h-full w-full overflow-hidden bg-cherry-200 bg-fixed opacity-0 transition duration-300 ease-in-out hover:opacity-20"></div></div>
            <h2 className="text-lg font-bold">{article.title}</h2>
            <p>{formatDate(article.created_at)}</p>
          </Link>
   
        })}



        </div>
    </>

}
