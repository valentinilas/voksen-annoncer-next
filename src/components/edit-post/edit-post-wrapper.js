
import EditPost from "./edit-post";
import { fetchCurrentUser } from "@/lib/fetchCurrentUser";
import { redirect } from "next/navigation";
import { fetchPublicSingleAd } from "@/lib/fetchPublicSingleAd";
import { apiFetchRegions } from "@/utils/api/fetch-helpers";
import { apiFetchCategories } from "@/utils/api/fetch-helpers";

export async function EditPostWrapper({slug}) {
    console.log(slug);
    const userData = await fetchCurrentUser();

    if (!userData?.user?.id) {
        redirect('/sign-in');
    }

    const {ad} = await fetchPublicSingleAd(slug);


    const { categories } = await apiFetchCategories();
   
        const { regions } = await apiFetchRegions();
    return <EditPost categories={categories} regions={regions} initialData={ad} />;
}