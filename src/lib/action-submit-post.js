'use server';

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'


// Maximum number of images allowed
const MAX_IMAGES = 12;
// Maximum file size allowed (2 MB in bytes)
const MAX_FILE_SIZE = 2 * 1024 * 1024;


export async function submitPost(prevState, formData) {
    const supabase = createClient();

    // Extract form data
    const title = formData.get('title');
    const description = formData.get('description');
    const images = formData.getAll('images');
    const region = formData.get('region');
    const category = formData.get('category');
    const subcategory = formData.get('sub-category');


    console.log(formData);

    // Validate number of images
    if (images.length > MAX_IMAGES) {
        return { error: `Maximum ${MAX_IMAGES} images allowed.` };
    }

    /**
     * 
     * 1. Upload Images and get their url and dimensions
     * 2. Save the ad details to the database.
     */

    // Helper function to handle image upload

    const handleImageUpload = async (file) => {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}.${fileExt}`;
        const filePath = `ad-images/${fileName}`;


        // Validate file type (should be image)
        if (!file.type.startsWith('image/')) {
            return { error: 'File is not an image.' };
        }

        // Validate file size
        if (file.size > MAX_FILE_SIZE) {
            return { error: `Maximum file size exceeded (${MAX_FILE_SIZE / 1024 / 1024} MB).` };
        }

        // Use a server-side image processing library like Sharp
        const sharp = require('sharp');
        const metadata = await sharp(await file.arrayBuffer()).metadata();

        let { error } = await supabase.storage
            .from('voksen-annoncer')
            .upload(filePath, file);

        if (error) {
            console.error('Error uploading image:', error);
            return null;
        }

        return { filePath, width: metadata.width, height: metadata.height };

    };


    // Helper function to get public URL of uploaded image

    const getPublicUrl = (filePath) => {
        const { data, error } = supabase.storage.from('voksen-annoncer').getPublicUrl(filePath);
        if (error) {
            console.error('Error getting public URL:', error);
            return null;
        }
        return data.publicUrl;
    };

    // Upload files and get their URLs along with dimensions
    const imageDetails = [];
    for (let i = 0; i < images.length; i++) {
        const uploadResult = await handleImageUpload(images[i]);
        if (uploadResult.error) {
            // Handle the error where file type is not an image
            return { error: uploadResult.error };
        }

        if (uploadResult) {
            const publicUrl = getPublicUrl(uploadResult.filePath);
            if (publicUrl) {
                imageDetails.push({
                    image_url: publicUrl,
                    width: uploadResult.width,
                    height: uploadResult.height
                });
            } else {
                // Handle error getting public URL
                return { error: 'Failed to get public URL for uploaded image.' };
            }
        } else {
            // Handle error uploading image
            return { error: 'Failed to upload image.' };
        }
    }

    try {
        // Save the ad details to the database
        const { data: adData, error: adError } = await supabase
            .from('ads')
            .insert({
                title: title,
                description: description,
                region_id: region,
                category_id: category,
                sub_category_id: subcategory
            })
            .select();

        const adId = adData[0].uuid;


        if (adError) {
            console.error('Error creating ad:', adError);
            return { error: adError.message };
        }

        // Save the image details in the ad_images table
        const { error: imageError } = await supabase
            .from('ad_images')
            .insert(
                imageDetails.map((imageDetail) => ({
                    ad_id: adId,
                    image_url: imageDetail.image_url,
                    image_width: imageDetail.width,
                    image_height: imageDetail.height
                }))
            );



        if (imageError) {
            console.error('Error creating ad:', imageError);
            return { error: imageError.message };
        }





        revalidatePath('/', 'layout')
        redirect('/posts')
      
    } catch (error) {
        console.error('Error submitting post:', error);
        return { error: error.message };
    }
}