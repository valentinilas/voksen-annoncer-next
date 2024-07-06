
import { AdTable } from "@/components/admin/admin-ad-table";
import { fetchAdminAdList } from "@/lib/fetchAdminAdList";
import { AdminWrapper } from "@/components/admin/admin-wrapper";

import { getTranslations } from 'next-intl/server';

export async function generateMetadata({ params, searchParams }, parent) {
    const t = await getTranslations();

    return {
        title: `${t("navigation.admin")} | ${t("navigation.site-name")}`,
    };

}

export default async function AdminPage() {


    const { ads } = await fetchAdminAdList();

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
