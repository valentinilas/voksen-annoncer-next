import Label from "../label/label";
import { UserIcon, ChatBubbleLeftRightIcon, EnvelopeIcon, DevicePhoneMobileIcon, MapPinIcon, UserCircleIcon, ChatBubbleBottomCenterTextIcon, SparklesIcon } from "@heroicons/react/24/outline";
import { cdnUrl } from "@/utils/imagekit/cdn-url";
import { useTranslations } from "next-intl";
import { calculateAge } from "@/utils/calculate-age/calculate-age";
import Image from "next/image";

export default function AdProfile({ profileData, currentSessionUser }) {
    const t = useTranslations();
    const isLoggedIn = currentSessionUser !== null;

    const { avatar_url, username, bio, birthday, regions, genders, contact_email, contact_phone, contact_sms, email_visible, phone_visible, sms_visible, age_visible } = profileData;

    const age = birthday ? calculateAge(new Date(birthday).getFullYear()) : null;


    return <>
        {avatar_url && (
            <div className="text-center mb-6">
                <Image
                    className="rounded-full border-4 border-neutral-content size-32 mx-auto mb-2"
                    src={cdnUrl(avatar_url, 300, 300)}
                    alt={`Avatar ${username}`}
                    width={128}
                    height={128}
                />
                <Label type="profile" className="justify-center" Icon={UserIcon}>
                    <span className="font-bold text-lg mb-1">{username}</span>
                </Label>
            </div>

        )}

        {bio && bio!=="null" && <p className="mb-2 bg-base-200 p-4 rounded-box">
            <Label type="profile" Icon={ChatBubbleBottomCenterTextIcon}>
                <span className="font-bold mb-1">{t("profile.bio")}</span>
            </Label>
            <span className="">{bio}</span>
        </p>}
        {age && <p className="mb-2 bg-base-200 p-4 rounded-box">
            <Label type="profile" Icon={SparklesIcon}>
                <span className="font-bold mb-1">{t("profile.age")}</span>
            </Label>
            {age_visible ? (<span className="">{age}</span>) : <span className="">{t("profile.user-hidden-age")}</span>}
        </p>
        }
        <p className="mb-2 bg-base-200 p-4 rounded-box">
            <Label type="profile" Icon={UserCircleIcon}>
                <span className="font-bold mb-1">{t("profile.gender")}</span>
            </Label>
            {/* <span className="">{genders?.gender_name}</span> */}
            <span className="">{t(`genders.${genders?.gender_name}`)}</span>
        </p>
        <p className="mb-2 bg-base-200 p-4 rounded-box">
            <Label type="profile" Icon={MapPinIcon}>
                <span className="font-bold mb-1">{t("profile.location")}</span>
            </Label>
            <span className="">{regions?.region_name}</span>
        </p>
        <h4 className="text-xl mb-4 mt-6 ">{t("profile.contact")}</h4>

        {isLoggedIn ? (
            <>
                {email_visible ? <p className="mb-2 bg-base-200 p-4 rounded-box">
                    <Label type="profile" Icon={EnvelopeIcon}>
                        <span className="font-bold mb-1">E-mail</span>
                    </Label>
                    <span className="">{contact_email}</span>
                </p> : <p className="mb-2 bg-base-200 p-4 rounded-box">{t("profile.user-hidden-email")}</p>}

                {phone_visible ? <p className="mb-2 bg-base-200 p-4 rounded-box">
                    <Label type="profile" Icon={DevicePhoneMobileIcon}>
                        <span className="font-bold mb-1">{t("profile.phone")}</span>
                    </Label>
                    <span className="">{contact_phone}</span>
                </p> : <p className="mb-2 bg-base-200 p-4 rounded-box">{t("profile.user-hidden-phone")}</p>}

                {sms_visible ? <p className="mb-2 bg-base-200 p-4 rounded-box">
                    <Label type="profile" Icon={ChatBubbleLeftRightIcon}>
                        <span className="font-bold mb-1">{t("profile.sms")}</span>
                    </Label>
                    <span className="">{contact_sms}</span>
                </p> : <p className="mb-2 bg-base-200 p-4 rounded-box">{t("profile.user-hidden-sms")}</p>}
            </>) : (
            <p className="text-md">{t("profile.log-in-contact")}</p>
        )}
    </>

}

