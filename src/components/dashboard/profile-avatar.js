import { supabase } from "../../lib/supabase";
import { useState, useRef, useEffect } from "react";
import { UserIcon } from "@heroicons/react/16/solid";

import { useAuth } from "../../lib/auth-context";
import { cdnUrl } from "../../util/cdn-url";


export default function Avatar() {
    const fileInputRef = useRef(null);
    const { profileData, setProfileData } = useAuth();
    const [formData, setFormData] = useState({});
    const [avatarisLoading, setAvatarIsLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState('');



    // Data
    const { profile, loading: profileLoading, error: profileError } = profileData;


    useEffect(() => {
        if (!formData.avatar_url) {
            return;
        }
        const saveData = async () => {
            await handleSave();
        }
        saveData();
    }, [formData])



    // Handle Avatar Change
    const handleSave = async () => {

        if (!profile) {
            console.error("Profile is not defined");
            setAvatarIsLoading(false);
            return;
        }
        try {
            const { data, error } = await supabase
                .from('profiles')
                .update(formData)
                .eq('id', profile.id)
                .select();

            if (error) {
                throw error;
            }

            setProfileData((previousData) => {
                return {
                    profile: { ...previousData.profile, ...formData },
                    loading: false,
                    error: null
                }
            });

            setAvatarIsLoading(false);





        } catch (error) {
            console.error("Error updating profile:", error);
            setAvatarIsLoading(false);

        }
    };

    const handleImageUpload = async (file) => {
        console.log('HANDLE IMAGE UPLOAD');
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}.${fileExt}`;
        const filePath = `profile-images/${fileName}`;

        let { error } = await supabase.storage
            .from('voksen-annoncer')
            .upload(filePath, file);

        if (error) {
            console.error('Error uploading image:', error);
            setAvatarIsLoading(false);

            return null;
        }

        return filePath;
    };

    const getPublicUrl = (filePath) => {
        console.log('HANDLE GET PUBLIC URL');

        const { data, error } = supabase.storage.from('voksen-annoncer').getPublicUrl(filePath);
        if (error) {
            console.error('Error getting public URL:', error);
            setAvatarIsLoading(false);

            return null;
        }
        return data.publicUrl;
    };

    const handleProfileImageClick = () => {
        console.log('HANDLE PROFILE IMAGE CLICK');
        fileInputRef.current.click();
    };

    const handleFileChange = async (event) => {
        setAvatarIsLoading(true);
        const file = event.target.files[0];

        if (file) {
            // Validate file type
            const validImageTypes = ['image/jpeg', 'image/png', 'image/gif'];
            if (!validImageTypes.includes(file.type)) {
                setErrorMessage('Invalid file type. Only JPEG, PNG, and GIF images are allowed.');
                setAvatarIsLoading(false);
                return;
            }

            // Validate file size
            const maxSizeInBytes = 2 * 1024 * 1024; // 2 MB
            if (file.size > maxSizeInBytes) {
                setErrorMessage('File size exceeds the 2 MB limit.');
                setAvatarIsLoading(false);
                return;
            }

            setErrorMessage(''); // Clear previous errors if any


            const filePath = await handleImageUpload(file);
            if (filePath) {
                const publicUrl = await getPublicUrl(filePath);
                if (publicUrl) {
                    setFormData((previousFormData) => ({
                        ...previousFormData,
                        avatar_url: publicUrl
                    }));
                    // await handleSave(); moved to useEffect
                }
            }
        }
    };



    return (<div className="text-center mb-5">
        {profile?.avatar_url ? (
            <img
                onClick={handleProfileImageClick}
                className="rounded-full border-4 border-cherry-600 size-32 mx-auto mb-2 hover:border-white transition-colors cursor-pointer"
                src={cdnUrl(profile?.avatar_url,300,300)}
                alt={`Avatar ${profile?.username}`}
            />
        ) : (
            <div className="size-32 bg-cherry-100 border-4 border-white hover:bg-cherry-300 cursor-pointer transition-colors flex items-center justify-center rounded-full mx-auto mb-6"
                onClick={handleProfileImageClick}
            >
                <UserIcon className="size-16 text-cherry-200" />
            </div>
        )}
        {avatarisLoading && <p>Uploading...</p>}
        {errorMessage && <p className="text-red-500">{errorMessage}</p>}


        <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            onChange={handleFileChange}
        />

    </div>);
}