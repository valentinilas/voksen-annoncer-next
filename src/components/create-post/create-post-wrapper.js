import { fetchCategories } from "@/lib/fetchCategories";
import { fetchRegions } from "@/lib/fetchRegions";
import NewPost from "./create-post";

export async function CreatePostWrapper() {
    const { categories } = await fetchCategories();
    const { regions } = await fetchRegions();
    return <NewPost categories={categories} regions={regions} />;
}