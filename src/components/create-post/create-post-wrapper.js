import { fetchCategories } from "@/lib/fetchCategories";
// import { fetchRegions } from "@/lib/fetchRegions";
import NewPost from "./create-post";
import { fetchCurrentUser } from "@/lib/fetchCurrentUser";
import { redirect } from "next/navigation";

import { apiFetchRegions } from "@/utils/api/fetch-helpers";

export async function CreatePostWrapper() {
    const userData = await fetchCurrentUser();

    if (!userData?.user?.id) {
        redirect('/sign-in');
    }
    const { categories } = await fetchCategories();
    const { regions } = await apiFetchRegions();
    
    return <NewPost categories={categories} regions={regions} />;
}