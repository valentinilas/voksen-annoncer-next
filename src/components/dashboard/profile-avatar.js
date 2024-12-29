"use client";

import { useRef, useState } from "react";
import { UserIcon } from "@heroicons/react/16/solid";
import { cdnUrl } from "@/utils/imagekit/cdn-url";
import { handleAvatarUpload } from "@/lib/handleAvatarUpload";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { createAvatarValidationSchema } from "./avatar-client-validation-schema";
import { useTranslations } from "next-intl";
import Image from "next/image";

export default function Avatar({ profile }) {
    const fileInputRef = useRef(null);

    const [serverValidationError, setServerValidationError] = useState({ error: null });

    // Translations
    const t = useTranslations();
    const validationSchema = createAvatarValidationSchema(t);

    // React Hook Form
    const {
        handleSubmit,
        register,
        formState: { errors, isSubmitting },
    } = useForm({
        mode: "onChange",
        resolver: yupResolver(validationSchema)
    });


    const handleProfileImageClick = () => {
        // Trigger the file input
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleFileChange = (event) => {
        handleSubmit(onSubmit)();
    };

    const onSubmit = async (data) => {
        try {
            const file = data.image[0];
            if (!file) return;


            const formData = new FormData();
            formData.append('image', file);
            formData.append('profileId', profile.id);

            const result = await handleAvatarUpload(formData);
            if (result?.error) {
                setServerValidationError({ error: result.error })
                throw new Error(result.error);

            }


        } catch (error) {
            console.error(error.message || 'An error occurred during upload');
        }
    };



    return (

        <form onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data">

            <div className="text-center mb-5">
                {profile?.avatar_url ? (
        
                    <Image 
                    onClick={handleProfileImageClick}
                     className="rounded-full border-4 border-cherry-600 size-32 mx-auto mb-2 hover:border-white transition-colors cursor-pointer"
                     src={cdnUrl(profile?.avatar_url, 128, 128)}
                     alt={`Avatar ${profile?.username}`}
                    width={128} height={128} 
                    />
                ) : (
                    <div
                        className="size-32 bg-cherry-100 border-4 border-white hover:bg-cherry-300 cursor-pointer transition-colors flex items-center justify-center rounded-full mx-auto mb-6"
                        onClick={handleProfileImageClick}
                    >
                        <UserIcon className="size-16 text-cherry-200" />
                    </div>
                )}
                {isSubmitting && <p>Uploading...</p>}
                {errors?.image && <p className="error text-red-500 text-sm mt-2">{errors?.image?.message}</p>}
                {serverValidationError.error && <div>{serverValidationError.error.map((error, index) => <p key={index} className="error text-red-500 text-sm mt-2">{error}</p>)}</div>}


                <input
                    type="file"
                    className="hidden"
                    name="image"
                    {...register("image", {
                        onChange: (e) => handleFileChange(e)
                    })}
                    ref={(e) => {
                        register("image").ref(e)
                        fileInputRef.current = e
                    }}
                />
            </div>
        </form>
    );
}
