import Button from "../button/button";
import Link from "next/link";

import Post from "./post";

import Label from "../label/label";
import { CalendarDaysIcon, PlusIcon } from "@heroicons/react/24/outline";

import { fetchDashboardAds } from "@/lib/fetchDashboardAds"
import { getTranslations } from "next-intl/server";

export default async function Posts() {
    const t = await getTranslations();


    const data = await fetchDashboardAds();
    if (data.error) {
        return <>Error loading dashboard</>
    }
    const { ads } = data;

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
