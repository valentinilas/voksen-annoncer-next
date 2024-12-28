"use client";

import { useEffect, useState, useRef } from "react";
import {
    ChatBubbleLeftRightIcon,
    EnvelopeIcon,
    DevicePhoneMobileIcon,
    MapPinIcon, UserCircleIcon,
    ChatBubbleBottomCenterTextIcon,
    SparklesIcon
} from "@heroicons/react/24/outline";


import { useForm } from "react-hook-form";

import Button from "../button/button";

import Avatar from "./profile-avatar";
import ConfirmationModal from "../confirmation-modal/confirmation-modal";
import translateArray from "@/utils/translations/translate-array";
import { useTranslations } from "next-intl";

import { handleProfileUpdate } from "@/lib/handleProfileUpdate";
import { handleDeleteProfile } from "@/lib/handleDeleteProfile";

import { createProfileValidationSchema } from "./profile-validation-schema";

import { yupResolver } from "@hookform/resolvers/yup";

export default function ProfileDetail({ currentUser, profile, regions, genders }) {

    // console.log(profile);
    // console.log(genders);
    // console.log(regions);


    // const profileId = p

    const t = useTranslations();

    const [editing, setEditing] = useState(false);
    const [serverValidationError, setServerValidationError] = useState({ error: null });
    const [profileUpdateSuccess, setProfileUpdateSuccess] = useState(false);


    const validationSchema = createProfileValidationSchema(t);
    const { register, handleSubmit, setValue, trigger, formState: { errors, isSubmitting, isValid } } = useForm({
        mode: "onChange",
        resolver: yupResolver(validationSchema)
    });

    const fieldsToLoad = ["username", "birthday", "bio", "gender_id", "region_id", "contact_email", "contact_phone", "contact_sms", "email_visible", "phone_visible", "sms_visible", "age_visible"];

    useEffect(() => {
        if (profile) {
            fieldsToLoad.forEach(key => {
                if (profile[key] !== undefined) {
                    setValue(key, profile[key]);
                }
            });

        }
    }, [profile]);



    const dialog = useRef(); // we use forward ref in the real dialog

    function showModal() {
        dialog.current.open();
    }

    function hideModal() {
        dialog.current.close();
    }

    async function confirmDelete() {
        try{
            await handleDeleteProfile();
        } catch(error){
            console.log(error);
        }
        

        dialog.current.close();

    }



    const onSubmit = handleSubmit(async data => {

        const formData = new FormData();

        // Append text fields
        Object.entries(data).forEach(([key, value]) => {
            formData.append(key, value);
        });

        const response = await handleProfileUpdate(formData, profile.id);

        if (response?.error) {
            setServerValidationError({ error: response.error });
        } else {
            setEditing(false);
            setServerValidationError({ error: null });
            setProfileUpdateSuccess(true);

            setTimeout(() => {
                setProfileUpdateSuccess(false); // Hide the success message after 2 seconds
            }, 3000);
        }
    });




    const getMaxDate = () => {
        const today = new Date();
        today.setFullYear(today.getFullYear() - 18);
        return today.toISOString().split('T')[0];
    };

    const translatedGenders = translateArray(t, 'genders', 'gender_name', genders);

    const handleValidateAllFields = async () => {
        try {
            await trigger(); // Trigger validation for all fields
        } catch (error) {
            console.error("Validation error:", error);
        }
    };

    return (
        <div className="h-full ">
            <ConfirmationModal ref={dialog} onCancel={() => { hideModal() }} onConfirm={() => confirmDelete()} />

            <Avatar profile={profile} />

            <div className="flex gap-2 justify-center my-6">
                {editing ? (
                    <>
                        <Button disabled={isSubmitting || !isValid}
                            variant="primary" onClick={handleSubmit(onSubmit)}>{t("profile.save")}</Button>
                        <Button variant="secondary" onClick={() => { setEditing(false) }}>{t("profile.cancel")}</Button>
                    </>
                ) : (
                    <>
                        <Button variant="primary" onClick={() => {
                            setEditing(true)
                            handleValidateAllFields();
                        }}>{t("profile.edit-profile")}</Button>
                        <Button variant="tertiary" onClick={() => showModal()}>{t("profile.delete-account")}</Button>
                    </>
                )}
            </div>


            <form onSubmit={handleSubmit(onSubmit)}>
                {serverValidationError.error && <div>{serverValidationError.error.map((error, index) => <p key={index} className="error text-red-500 text-sm mt-2">{error}</p>)}</div>}
                {profileUpdateSuccess && <div className="toast toast-start">
                    <div className="alert alert-success">
                        <span>Profile updated.</span>
                    </div>
                </div>}
                {/* Username */}
                <div className="mt-4">
                    <label htmlFor="username" className="block  text-sm font-bold mb-2">{t("profile.username")}</label>
                    <input
                        className="input input-bordered w-full"
                        type="text"
                        id="username"
                        name="username"
                        disabled={!editing}
                        {...register("username")}

                        required
                    />
                    {errors?.username && <p className="error text-red-500 text-sm mt-2">{errors?.username?.message}</p>}
                </div>
                {/* Birthday */}
                <div className="mt-4">
                    <label htmlFor="birthday" className="block  text-sm font-bold mb-2">{t("profile.birthday")}</label>
                    <input
                        className="input input-bordered w-full"
                        type="date"
                        id="birthday"
                        name="birthday"
                        disabled={!editing}
                        max={getMaxDate()}
                        {...register("birthday")}

                        required
                    />
                    {errors?.birthday && <p className="error text-red-500 text-sm mt-2">{errors?.birthday?.message}</p>}
                </div>
                 {/* AGE Visibility */}
                 <div className="mt-4">
                    <label className="label cursor-pointer">
                        <span className="label-text">{t("profile.age-visibility")}</span>
                        <input
                            name="age_visible"
                            type="checkbox"
                            className="checkbox"
                            disabled={!editing}
                            {...register("age_visible")}
                        />
                        {errors?.age_visible && <p className="error text-red-500 text-sm mt-2">{errors?.age_visible?.message}</p>}
                    </label>
                </div>



                {/* BIo */}
                <div className="mt-4">
                    <label htmlFor="bio" className="block  text-sm font-bold mb-2">{t("profile.bio")}</label>
                    <textarea
                        className="textarea textarea-bordered w-full h-24"
                        id="bio"
                        name="bio"
                        disabled={!editing}
                        {...register("bio")}
                        
                    />
                    {errors?.bio && <p className="error text-red-500 text-sm mt-2">{errors?.bio?.message}</p>}
                </div>

                

                {/* Gender */}
                <div className="mt-4">
                    <label htmlFor="gender_id" className="block  text-sm font-bold mb-2">{t("profile.gender")}</label>
                    <select
                        className="select select-bordered w-full"
                        id="gender_id"
                        name="gender_id"
                        disabled={!editing}
                        {...register("gender_id")}
                        required
                    >
                        <option value="">Select an option</option>
                        {translatedGenders.map((option, index) => (
                            <option key={index} value={option.id}>
                                {option.gender_name}
                            </option>
                        ))}
                    </select>
                    {errors?.gender_id && <p className="error text-red-500 text-sm mt-2">{errors?.gender_id?.message}</p>}
                </div>


                {/* Gender */}
                <div className="mt-4">
                    <label htmlFor="region_id" className="block  text-sm font-bold mb-2">{t("profile.location")}</label>
                    <select
                        className="select select-bordered w-full"
                        id="region_id"
                        name="region_id"
                        disabled={!editing}
                        {...register("region_id")}
                        required
                    >
                        <option value="">Select an option</option>
                        {regions.map((option, index) => (
                            <option key={index} value={option.id}>
                                {option.region_name}
                            </option>
                        ))}
                    </select>
                    {errors?.region_id && <p className="error text-red-500 text-sm mt-2">{errors?.region_id?.message}</p>}
                </div>

                <h4 className="text-xl mb-4 mt-6 ">{t("profile.contact")}</h4>

                {/* Contact Email */}
                <div className="mt-4">
                    <label htmlFor="contact_email" className="block  text-sm font-bold mb-2">{t("profile.email")}</label>
                    <input
                        className="input input-bordered w-full"
                        type="text"
                        id="contact_email"
                        name="contact_email"
                        disabled={!editing}
                        {...register("contact_email")}
                        required
                    />
                    {errors?.contact_email && <p className="error text-red-500 text-sm mt-2">{errors?.contact_email?.message}</p>}
                </div>

                {/* Email Visibility */}
                <div className="mt-4">
                    <label className="label cursor-pointer">
                        <span className="label-text">{t("profile.email-visibility")}</span>
                        <input
                            name="email_visible"
                            type="checkbox"
                            className="checkbox"
                            disabled={!editing}
                            {...register("email_visible")}
                        />
                        {errors?.email_visible && <p className="error text-red-500 text-sm mt-2">{errors?.email_visible?.message}</p>}
                    </label>
                </div>

                {/* Contact Phone */}
                <div className="mt-4">
                    <label htmlFor="contact_phone" className="block  text-sm font-bold mb-2">{t("profile.phone")}</label>
                    <input
                        className="input input-bordered w-full"
                        type="text"
                        id="contact_phone"
                        name="contact_phone"
                        disabled={!editing}
                        {...register("contact_phone")}
                        required
                    />
                    {errors?.contact_phone && <p className="error text-red-500 text-sm mt-2">{errors?.contact_phone?.message}</p>}
                </div>

                {/* Phone Visibility */}
                <div className="mt-4">
                    <label className="label cursor-pointer">
                        <span className="label-text">{t("profile.phone-visibility")}</span>
                        <input
                            name="phone_visible"
                            type="checkbox"
                            className="checkbox"
                            disabled={!editing}
                            {...register("phone_visible")}
                        />
                        {errors?.phone_visible && <p className="error text-red-500 text-sm mt-2">{errors?.phone_visible?.message}</p>}
                    </label>
                </div>


                {/* Contact SMS */}
                <div className="mt-4">
                    <label htmlFor="contact_sms" className="block  text-sm font-bold mb-2">{t("profile.sms")}</label>
                    <input
                        className="input input-bordered w-full"
                        type="text"
                        id="contact_sms"
                        name="contact_sms"
                        disabled={!editing}
                        {...register("contact_sms")}
                        required
                    />
                    {errors?.contact_sms && <p className="error text-red-500 text-sm mt-2">{errors?.contact_sms?.message}</p>}
                </div>

                {/* SMS Visibility */}
                <div className="mt-4">
                    <label className="label cursor-pointer">
                        <span className="label-text">{t("profile.sms-visibility")}</span>
                        <input
                            name="sms_visible"
                            type="checkbox"
                            className="checkbox"
                            disabled={!editing}
                            {...register("sms_visible")}
                        />
                        {errors?.sms_visible && <p className="error text-red-500 text-sm mt-2">{errors?.sms_visible?.message}</p>}
                    </label>
                </div>



            </form>


        </div>
    );
}
