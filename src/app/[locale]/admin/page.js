
import { AdTable } from "@/components/admin/admin-ad-table";
import { fetchAdminAdList } from "@/lib/fetchAdminAdList";
import { AdminWrapper } from "@/components/admin/admin-wrapper";

import { getTranslations } from 'next-intl/server';

export async function generateMetadata({ params, searchParams }, parent) {
    const t = await getTranslations();
    const { locale } = await params;

    return {
        title: `${t("navigation.admin")} | ${t("navigation.site-name")}`,
        alternates: {
            canonical: `https://www.voksen-annoncer.com/${locale}/admin`,
            languages: {
                'en': `https://www.voksen-annoncer.com/en/admin`,
                'da': `https://www.voksen-annoncer.com/da/admin`,
                'x-default': `https://www.voksen-annoncer.com/da/admin`
            },
        },
    };

}

export default async function AdminPage() {


    const { ads } = await fetchAdminAdList();

    // let ads = [];
    // try {
    //     const url =`${process.env.NEXT_PUBLIC_BASE_URL}/api/get-admin-ads`;
    //     console.log(url);
    //     const res = await fetch(url,{
    //         next: { 
    //             revalidate: 30, // Use Next.js 13+ cache revalidation
    //             tags: ['admin-ads'] // Add a cache tag for manual revalidation
    //         }
    //     });
    //     if (!res.ok) {
    //         throw new Error(`Failed to fetch: ${res.status}`);
    //     }
    //     const data = await res.json();
    //     ads = data.ads;
    // } catch (error) {
    //     console.error('Error fetching admin ads:', error);
    // }



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
