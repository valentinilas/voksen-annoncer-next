
import { AdTable } from "@/components/admin/admin-ad-table";
import { fetchAdminAdList } from "@/lib/fetchAdminAdList";

export default async function AdminPage() {


    const { ads } = await fetchAdminAdList();

    return (
        <>
            <div className="bg-base-200 p-5 my-2 rounded-box shadow-sm">
                <AdTable ads={ads} />
            </div>
        </>

    );
}
