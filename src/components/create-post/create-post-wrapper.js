import { fetchCategories } from "@/lib/fetchCategories";
// import { fetchRegions } from "@/lib/fetchRegions";
import NewPost from "./create-post";
import { fetchCurrentUser } from "@/lib/fetchCurrentUser";
import { redirect } from "next/navigation";


export async function CreatePostWrapper() {
    const userData = await fetchCurrentUser();

    if (!userData?.user?.id) {
        redirect('/sign-in');
    }


    const { categories } = await fetchCategories();
    // const { regions } = await fetchRegions();
    // Regions
    const regionsRequest = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/get-regions`, {
        cache: 'force-cache',
        next: { tags: ['regions'],revalidate: 3600,  },
    });

    if (!regionsRequest.ok) {
        throw new Error(`Failed to fetch Regions: ${res.status}`);
    }

    const { regions } = await regionsRequest.json();
    
    return <NewPost categories={categories} regions={regions} />;
}