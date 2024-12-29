
import { AdTable } from "@/components/admin/admin-ad-table";
// import { fetchAdminAdList } from "@/lib/fetchAdminAdList";
import { AdminWrapper } from "@/components/admin/admin-wrapper";

import { getTranslations } from 'next-intl/server';

export async function generateMetadata({ params, searchParams }, parent) {
    const t = await getTranslations();

    return {
        title: `${t("navigation.admin")} | ${t("navigation.site-name")}`,
    };

}

export default async function AdminPage() {


    // const { ads } = await fetchAdminAdList();

    let ads = [];
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/admin-ads`);
        if (!res.ok) {
            throw new Error(`Failed to fetch: ${res.status}`);
        }
        const data = await res.json();
        ads = data.ads;
    } catch (error) {
        console.error('Error fetching admin ads:', error);
    }



    return (
        <>
            <AdminWrapper>
                <div className="bg-base-100 p-5 my-2 rounded-box shadow-sm">
                    <AdTable ads={ads} />
                </div>
            </AdminWrapper>
        </>

    );
}
