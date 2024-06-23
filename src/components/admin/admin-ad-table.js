import AdRow from "./admin-ad-row";

export const AdTable = async ({ ads }) => {
    console.log(ads);
    return <>
        {ads && ads.length > 0 ? (
            <div className="overflow-x-auto">
                <table className="table">
                    <thead>
                        <tr>
                            <th></th>
                            <th>ID</th>
                            <th>User</th>
                            <th>Title</th>
                            <th>Link</th>
                            <th>Approved</th>
                            <th>Delete</th>

                        </tr>
                    </thead>
                    <tbody>
                        {ads.map((ad, index) => {
                            return <AdRow ad={ad} index={index} key={ad.uuid} />
                        })}

                    </tbody>
                </table>
            </div>
        ) : (
            <p className="text-center py-10">No ads found</p>
        )}
    </>
}