import Button from "../button/button";
import Link from "next/link";

import Post from "./post";

import { PlusIcon } from "@heroicons/react/24/outline";

import { fetchDashboardAds } from "@/lib/fetchDashboardAds"
import { getTranslations } from "next-intl/server";

export default async function Posts() {
    const t = await getTranslations();


    const data = await fetchDashboardAds();
    if (data.error) {
        return <>Error loading dashboard</>
    }
    const { ads } = data;

    if (!ads.length) {
        return <div className="mb-4 border-dashed border-2 border-base-100  shadow-sm px-5 py-10 hover:bg-base-200 transition-colors  rounded-box lg:h-full	 flex flex-col items-center justify-center">
            <h3 className="text-md mb-6 ">{t('ads.no-ads')}</h3>
            <Button to="/new-post">{t('ads.create-ad')}</Button>
        </div>;
    }

    return (
        <>
            <div className="flex justify-between items-center mb-5">
                <h4 className="text-xl  ">{t('ads.My ads')} ({ads.length})</h4>
                <Button variant="primary" Icon={PlusIcon} to="/new-post">{t('ads.create-ad')}</Button>
            </div>



            <ol>
                {ads.map((ad, index) => {
                    return <Post key={index} ad={ad} />
                })}

            </ol>
        </>

    );
}
