import { fetchCategories } from "@/lib/fetchCategories";
import { fetchRegions } from "@/lib/fetchRegions";
import EditPost from "./edit-post";
import { fetchCurrentUser } from "@/lib/fetchCurrentUser";
import { redirect } from "next/navigation";
import { fetchPublicSingleAd } from "@/lib/fetchPublicSingleAd";

export async function EditPostWrapper({slug}) {
    console.log(slug);
    const userData = await fetchCurrentUser();

    if (!userData?.user?.id) {
        redirect('/sign-in');
    }

    const {ad} = await fetchPublicSingleAd(slug);


    const { categories } = await fetchCategories();
    const { regions } = await fetchRegions();
    return <EditPost categories={categories} regions={regions} initialData={ad} />;
}