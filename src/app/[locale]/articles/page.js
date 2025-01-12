// app/articles/page.js (or wherever you are rendering articles)

import { fetchAllArticles } from "@/lib/fetchAllArticles";
import { formatDate } from "@/utils/formatter/format-date";
import Image from "next/image";
import Link from "next/link";
import { cdnUrl } from "@/utils/imagekit/cdn-url";
import DefaultImage from "@/components/default-image/default-image";
import { getTranslations } from "next-intl/server";
import  {generateAlternatesBlock}  from "@/utils/generate-canonical/generateAlternatesBlock";

export async function generateMetadata({ params, searchParams }) {
  const { locale } = await params;
  const t = await getTranslations();

  return {
    title: t("meta.articles.title"),
    description: t("meta.articles.description"),
    alternates: generateAlternatesBlock(locale, '/articles', await searchParams, true)
  };
}
export default async function Articles(props) {
  const searchParams = await props.searchParams;
  const currentPage = parseInt(searchParams.page) || 1;
  const { articles, totalPages } = await fetchAllArticles(currentPage, 12);
  const t = await getTranslations();

  if (!articles || articles.length === 0) {
    return (
      <article>
        <div className="bg-base-100 p-20 rounded-box shadow-sm">
          <h1 className="text-4xl mb-5 text-center">Ikke fundet</h1>
        </div>
      </article>
    );
  }

  return (
    <>
      <h1 className="text-2xl mb-5">Artikler</h1>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
        {articles.map((article) => (
          <Link href={`/articles/${article.Slug}`} key={article.id} className="article-card">
            <div className="relative overflow-hidden bg-cover bg-no-repeat rounded-box mb-5">
              {article.Image ? (
                <Image
                  src={cdnUrl(`https://cms.voksen-annoncer.com${article.Image.url}`, 400, 400)}
                  alt={article.Title}
                  width={article.Image.width}
                  height={article.Image.height}
                />
              ) : (
                <DefaultImage />
              )}
              <div className="absolute bottom-0 left-0 right-0 top-0 h-full w-full overflow-hidden bg-cherry-200 bg-fixed opacity-0 transition duration-300 ease-in-out hover:opacity-20"></div>
            </div>
            <h2 className="text-lg font-bold">{article.Title}</h2>
            <p>{formatDate(article.createdAt)}</p>
          </Link>
        ))}
      </div>

      {/* Pagination Controls */}

      {totalPages > 1 && (<div className="flex justify-center mt-10">
        <div className="join mx-auto mt-2">
          <Link
            className={`join-item btn ${currentPage <= 1 ? 'btn-disabled' : ''}`}
            href={`/articles?page=${currentPage > 1 ? currentPage - 1 : 1}`}
          >
            «
          </Link>
          <button className="join-item btn">
            {t("pagination.Page")} {currentPage} {t("pagination.of")} {totalPages}
          </button>
          <Link
            className={`join-item btn ${currentPage >= totalPages ? 'btn-disabled' : ''}`}
            href={`/articles?page=${currentPage < totalPages ? currentPage + 1 : totalPages}`}
          >
            »
          </Link>
        </div>
      </div>
      )}




    </>
  );
}
