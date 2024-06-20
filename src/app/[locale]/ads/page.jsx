import Link from "next/link";
import { fetchPublicAds } from "@/lib/fetchPublicAds";




export default async function Ads(){

    const {ads, total, error} = await fetchPublicAds();
    console.log(ads);

    return  <>
       <h1>Ads</h1>
        <p><Link href="/ads/ad-1">Ad1</Link></p>
        <p><Link href="/ads/ad-2">Ad1</Link></p>

        {ads.map(ad=>{
                return <div key={ad.uuid}>{ad.uuid}
                    <Link href={`ads/${ad.uuid}`}>View</Link>
                </div>
        })}
       
           
        
    </>
       
 
}