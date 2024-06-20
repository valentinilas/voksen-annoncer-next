import { fetchCurrentUser } from "@/lib/fetchCurrentUser"

export default async function AdProfile({ profileData }) {
    const {user} = await fetchCurrentUser();
    console.log('currentUser', user);
   return <span>LoggedIn: {user!==null ? 'YES': 'NOPE'}</span>

}

