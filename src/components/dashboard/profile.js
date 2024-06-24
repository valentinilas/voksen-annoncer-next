import ProfileDetail from "./profile-detail";

export async function DashboardProfile({ currentUser, profile, regions, genders }) {

    if (!profile) {
        return <span>Could not load profile</span>
    }

    return <ProfileDetail currentUser={currentUser} profile={profile} regions={regions} genders={genders} />;

}