'use server';

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createServerValidationSchema } from '@/components/create-post/validation-schema-server';
import { getTranslations } from 'next-intl/server';

import slugify from 'slugify';


function generateSlug(title) {
    const timestamp = new Date().getTime(); // Current timestamp in milliseconds
    const sluggedTitle = slugify(title, { lower: true, strict: true });
    return `${timestamp}-${sluggedTitle}`;
}

// Maximum number of images allowed
const MAX_IMAGES = 12;
// Maximum file size allowed (2 MB in bytes)
const MAX_FILE_SIZE = 2 * 1024 * 1024;

const supabase = createClient();

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

    const { error } = await supabase.storage
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

export async function submitPost(formData) {


    // Extract form data
    const title = formData.get('title');
    const description = formData.get('description');
    const region = formData.get('region');
    const category = formData.get('category');
    const subcategory = formData.get('subcategory');

    // Extract files
    const images = formData.getAll('images');

    const t = await getTranslations();
    const serverValidationSchema = createServerValidationSchema(t);



    // Validate the data
    try {
        await serverValidationSchema.validate({
            title,
            description,
            region,
            category,
            subcategory,
            images
        }, { abortEarly: false });
    } catch (validationError) {
        console.error('Validation error:', validationError.errors);
        return { error: validationError.errors };
    }


    try {

        // Upload files and get their URLs along with dimensions
        const imageDetails = await Promise.all(
            images.map(async (image) => {
                const uploadResult = await handleImageUpload(image);
                if (uploadResult?.error) {
                    throw new Error(uploadResult.error);
                }

                const publicUrl = getPublicUrl(uploadResult.filePath);
                if (!publicUrl) {
                    throw new Error('Failed to get public URL for uploaded image.');
                }

                return {
                    image_url: publicUrl,
                    width: uploadResult.width,
                    height: uploadResult.height,
                };
            })
        );

        const slug = generateSlug(title);

        // Save the ad details to the database
        // console.log('Saving to DB');
        const { data: adData, error: adError } = await supabase
            .from('ads')
            .insert({
                title: title,
                description: description,
                region_id: region,
                category_id: category,
                sub_category_id: subcategory,
                slug: slug
            })
            .select();

        const adId = adData[0].uuid;


        if (adError) {
            console.error('Error creating ad:', adError);
            return { error: adError.message };
        }

        // Save the image details in the ad_images table
        console.log('Saving images to DB');
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

    }
    catch (error) {
        console.error('Error submitting post:', error);
        return { error: error.message };
    }

    // Revalidate path and redirect
    revalidatePath('/', 'layout');
    redirect('/dashboard');



}
