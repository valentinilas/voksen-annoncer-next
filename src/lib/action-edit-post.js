'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createServerValidationSchema } from '@/components/edit-post/validation-schema-server';
import { getTranslations } from 'next-intl/server';

import slugify from 'slugify';
import { v4 as uuidv4 } from 'uuid';

function generateSlug(title) {
    const timestamp = new Date().getTime(); // Current timestamp in milliseconds
    const sluggedTitle = slugify(title, { lower: true, strict: true });
    return `${timestamp}-${sluggedTitle}`;
}

const MAX_IMAGES = 12;
const MAX_FILE_SIZE = 2 * 1024 * 1024;

const handleImageUpload = async (file, supabase) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${uuidv4()}.${fileExt}`;
    const filePath = `ad-images/${fileName}`;

    if (!file.type.startsWith('image/')) {
        return { error: 'File is not an image.' };
    }

    if (file.size > MAX_FILE_SIZE) {
        return { error: `Maximum file size exceeded (${MAX_FILE_SIZE / 1024 / 1024} MB).` };
    }

    const sharp = require('sharp');
    const metadata = await sharp(await file.arrayBuffer()).metadata();

    const { error } = await supabase.storage.from('voksen-annoncer').upload(filePath, file);

    if (error) {
        console.error('Error uploading image:', error);
        return null;
    }

    return { filePath, width: metadata.width, height: metadata.height };
};


// Function to delete images from storage
const deleteImagesFromStorage = async (removedImages, supabase) => {
    // Fetch the paths of the images to be removed
    const { data: imageData, error } = await supabase
        .from('ad_images')
        .select('image_url')
        .in('uuid', removedImages);

    if (error) {
        console.error('Error fetching image URLs from database:', error);
        throw new Error('Error fetching image URLs from database');
    }

    // Extract the paths from the URLs
    const imagePaths = imageData.map(image => {
        const parts = image.image_url.split('/');
        return 'ad-images/' + parts.pop(); // Assuming 'ad-images/' is the correct prefix
    });

    // Delete the images from storage
    if (imagePaths.length > 0) {
        const { error: deleteError } = await supabase.storage
            .from('voksen-annoncer')
            .remove(imagePaths);

        if (deleteError) {
            console.error('Error deleting images from storage:', deleteError);
            throw new Error('Error deleting images from storage');
        }
    }
};

const getPublicUrl = (filePath, supabase) => {
    const { data, error } = supabase.storage.from('voksen-annoncer').getPublicUrl(filePath);
    if (error) {
        console.error('Error getting public URL:', error);
        return null;
    }
    return data.publicUrl;
};

export async function editPost(formData, slug) {
    const supabase = await createClient();

    const title = formData.get('title');
    const description = formData.get('description');
    const region = formData.get('region');
    const category = formData.get('category');
    const subcategory = formData.get('subcategory');
    const existingImages = JSON.parse(formData.get('existingImages') || '[]');
    const removedImages = JSON.parse(formData.get('removedImages') || '[]');
    const newImages = formData.getAll('newImages');


    const t = await getTranslations();
    const serverValidationSchema = createServerValidationSchema(t);

    try {
        await serverValidationSchema.validate({
            title,
            description,
            region,
            category,
            subcategory,
            images: [...existingImages, ...newImages],
        }, { abortEarly: false });
    } catch (validationError) {
        console.error('Validation error:', validationError.errors);
        return { error: validationError.errors };
    }

    try {
        const newSlug = generateSlug(title);
        const { data: adData, error: adError } = await supabase
            .from('ads')
            .update({
                title,
                description,
                region_id: region,
                category_id: category,
                sub_category_id: subcategory,
                slug: newSlug
            })
            .eq('slug', slug)
            .select();

        if (adError) {
            console.error('Error updating ad:', adError);
            return { error: adError.message };
        }

        const adId = adData[0].uuid;

        // If there are removed images, delete them from storage & database
        if (removedImages.length > 0) {

            // Delete from storage
            await deleteImagesFromStorage(removedImages, supabase);

            // Delete from database
            const { error: removeError } = await supabase
                .from('ad_images')
                .delete()
                .in('uuid', removedImages);

            if (removeError) {
                console.error('Error removing images from database:', removeError);
                return { error: removeError.message };
            }


        }
        console.log('newImages', newImages);
        const newImageDetails = await Promise.all(
            newImages.map(async (image) => {
                const uploadResult = await handleImageUpload(image, supabase);
                console.log('UPLOAD RESULT',uploadResult);
                if (uploadResult?.error) {
                    throw new Error(uploadResult.error);
                }

                const publicUrl = getPublicUrl(uploadResult.filePath, supabase);
                console.log('PUBLIC URL',publicUrl);
                if (!publicUrl) {
                    throw new Error('Failed to get public URL for uploaded image.');
                }

                return {
                    ad_id: adId,
                    image_url: publicUrl,
                    image_width: uploadResult.width,
                    image_height: uploadResult.height,
                };
            })
        );
        console.log('NEW IMAGE DETAILS',newImageDetails);

        if (newImageDetails.length > 0) {
            const { error: insertError } = await supabase
                .from('ad_images')
                .insert(newImageDetails);

            if (insertError) {
                console.error('Error adding new images:', insertError);
                return { error: insertError.message };
            }
        }
    } catch (error) {
        console.error('Error editing post:', error);
        return { error: error.message };
    }

    revalidatePath('/', 'layout');
    redirect('/dashboard');
}
