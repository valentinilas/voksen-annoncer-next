
import Posts from "@/components/dashboard/posts";

export default async function Dashboard() {


    return <>

        <section className="dashboard">
            <div className="grid grid-cols-12 gap-6">
                <div className="col-span-12 lg:col-span-4 ">
                    <div className="h-full">
                        {/* <ProfileDetail /> */}
                    </div>

                </div>
                <div className="col-span-12 lg:col-span-8">
                    <Posts />
                </div>
            </div>
        </section>
    </>
}