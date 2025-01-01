'use client';


import { useTranslations } from 'next-intl';
import { SubmitButton } from "./submit-button";
import { editPost } from '@/lib/action-edit-post';
import translateArray from '@/utils/translations/translate-array';
import { useState } from 'react';
import { useEffect } from 'react';
import { useRef } from 'react';
import Image from 'next/image';

import { useForm } from 'react-hook-form';
import { yupResolver } from "@hookform/resolvers/yup"
import { createValidationSchema } from './validation-schema';


export default function EditPost({ categories, regions, initialData }) {
    const [selectedCategory, setSelectedCategory] = useState(initialData.category_id || '');
    const [serverValidationError, setServerValidationError] = useState({ error: null });
    const [existingImages, setExistingImages] = useState(initialData.ad_images || []);
    const [newImages, setNewImages] = useState([]);
    const fileInputRef = useRef(null); // Ref for the file input



    // Translations
    const t = useTranslations();

    const validationSchema = createValidationSchema(t);

    // React Hook Form
    const {

        handleSubmit,
        register,
        reset,
        setValue,
        formState: { errors, isSubmitting, isValid },
    } = useForm({
        mode: "onChange",
        resolver: yupResolver(validationSchema),
        defaultValues: {
            ...initialData,
            category: initialData.category_id,
            subcategory: initialData.sub_category_id,
            region: initialData.region_id,
        },
    });


    useEffect(() => {
        if (initialData) {
            reset({
                ...initialData,
                category: initialData.category_id,
                subcategory: initialData.sub_category_id,
                region: initialData.region_id,
            });
            setSelectedCategory(initialData.category_id);
        }
    }, [initialData, reset]);


    const handleImageUpload = async (e) => {
        const files = Array.from(e.target.files);

        // Use the existing validation schema's `images` field
        const imagesSchema = validationSchema.fields.images;

        const formValue = {
            images: files,
        };

        try {
            // Validate the entire files array using the schema
            await imagesSchema.validate(formValue.images);
            setNewImages((prevImages) => [...prevImages, ...files]);
        } catch (err) {
            // Handle validation errors
            alert(err.message || 'Error');
        }

        // Reset file input
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleRemoveExistingImage = (uuid) => {
        setExistingImages((prevImages) => prevImages.filter((image) => image.uuid !== uuid));
    };

    const handleRemoveNewImage = (index) => {
        setNewImages((prevImages) => prevImages.filter((_, i) => i !== index));
        // Reset file input in case no files are left
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };







    const onSubmit = handleSubmit(async data => {

        const formData = new FormData();
        // Append text fields
        formData.append('title', data.title);
        formData.append('description', data.description);
        formData.append('region', data.region);
        formData.append('category', data.category);
        formData.append('subcategory', data.subcategory);



        existingImages.forEach((image, index) => {
            formData.append(`existingImages[${index}]`, JSON.stringify(image));
        });

        const removedImages = initialData.ad_images.filter(initialImage => 
            !existingImages.some(currentImage => currentImage.uuid === initialImage.uuid)
          );
          
          formData.append('removedImages', JSON.stringify(removedImages.map(img => img.uuid)));

        newImages.forEach((image) => {
            formData.append(`newImages`, image);
        });




        const response = await editPost(formData, initialData.slug);

        if (response?.error) {
            setServerValidationError({ error: response.error })
        } else {
            reset();
        }
    });







    const handleMainCategoryChange = (e) => {
        setSelectedCategory(e.target.value);
        setValue('subcategory', ''); // This resets the form value for subcategory
    };



    // Render options for sub-categories based on selected main category
    const renderSubCategoryOptions = () => {
        const mainCategory = categories.find(cat => cat.category_id === Number(selectedCategory));
        if (mainCategory && mainCategory.ad_sub_categories) {
            const subcategories = mainCategory.ad_sub_categories || [];

            const translatedSubCategories = translateArray(t, 'subcategories', 'sub_category_name', subcategories);
            return translatedSubCategories.map(subcategory => (
                <option key={subcategory.sub_category_id} value={subcategory.sub_category_id}>{subcategory.sub_category_name}</option>
            ));
        }
        return null;
    };




    const translatedCategories = categories
        ? translateArray(t, 'categories', 'category_name', categories)
        : [];



    return (

        <div className="bg-base-100 p-5  rounded-box shadow-sm">
            <h1 className="text-2xl font-bold mb-4 ">{t("ads.edit-ad")}</h1>
            <form
                onSubmit={onSubmit}
                encType="multipart/form-data"
            >
                {serverValidationError.error && <p className="error text-red-500 text-sm mt-2">{serverValidationError.error}</p>}

                {/* Title input */}
                <div className="mb-4">
                    <label className="block text-sm font-bold mb-2" htmlFor="title">
                        {t("create-ad.title")}
                    </label>
                    <input
                        id="title"
                        name="title"
                        type="text"
                        className="input input-bordered w-full"
                        {...register("title")}

                    />
                    {errors?.title && <p className="error text-red-500 text-sm mt-2">{errors?.title?.message}</p>}


                </div>

                {/* Description input */}
                <div className="mb-4">
                    <label className="block text-sm font-bold mb-2" htmlFor="description">
                        {t("create-ad.description")}
                    </label>
                    <textarea
                        id="description"
                        name="description"
                        rows="7"
                        className="textarea textarea-bordered w-full"
                        {...register("description")}
                    ></textarea>
                    {errors?.description && <p className="error text-red-500 text-sm mt-2">{errors?.description?.message}</p>}
                </div>


                {/* Existing Images */}
                {existingImages.length > 0 && <div className="mb-4">
                    <label className="block text-sm font-bold mb-2">
                        {t('ads.ad-images')}
                    </label>
                    <div className="flex flex-wrap gap-2">
                        {existingImages.map((image, index) => (
                            <div key={image.uuid} className="border-2 rounded-xl p-2 text-center">
                                <Image src={image.image_url} alt="Existing Image" width={100} height={100} className="rounded-sm border-2" />
                                <button
                                    type="button"
                                    className="mt-2 bg-red-500 text-white rounded-full px-3 py-1"
                                    onClick={() => handleRemoveExistingImage(image.uuid)}
                                >
                                    {t('ads.delete')}
                                </button>
                            </div>
                        ))}
                    </div>
                </div>}

                {/* New Images */}
                <div className="mb-4">
                    <label className="block text-sm font-bold mb-2" htmlFor="images">
                        {t('ads.ad-add-images')}
                    </label>
                    <input
                        id="images"
                        name="images"
                        type="file"
                        multiple
                        className="file-input file-input-bordered w-full"
                        // ref={fileInputRef} // Assign the ref here
                        // {...register("images")}
                        {...register('images', {
                            onChange: (e) => handleImageUpload(e),
                            ref: fileInputRef // Pass the ref to the register function
                        })}
                    />
                    {errors?.images && <p className="error text-red-500 text-sm mt-2">{errors?.images?.message}</p>}
                    <div className="flex flex-wrap gap-2 mt-2">
                        {newImages.map((image, index) => (
                            <div key={index} className="border-2 rounded-xl p-2 text-center">
                                <Image src={URL.createObjectURL(image)} alt="New Image" width={100} height={100} className="rounded-sm border-2" />
                                <button
                                    type="button"
                                    className="mt-2 bg-red-500 text-white rounded-full px-3 py-1"
                                    onClick={() => handleRemoveNewImage(index)}
                                >
                                    {t('ads.delete')}
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Images input */}
                {/* <div className="mb-4">
                    <label className="block text-sm font-bold mb-2" htmlFor="images">
                        {t("create-ad.upload-images")}
                    </label>
                    <input
                        id="images"
                        name="images"
                        type="file"
                        multiple
                        className="file-input file-input-bordered w-full"
                        {...register("images")}
                    />
                    {errors?.images && <p className="error text-red-500 text-sm mt-2">{errors?.images?.message}</p>}
                </div> */}

                {/* Region select */}
                <div className="mb-4">
                    <label className="block text-sm font-bold mb-2" htmlFor="region">
                        {t("create-ad.region")}
                    </label>
                    <select
                        id="region"
                        name="region"
                        className="select select-bordered w-full"
                        {...register("region")}
                    >
                        <option value="">{t("create-ad.select-region")}</option>
                        {regions?.map((region) => (
                            <option key={region.id} value={region.id}>
                                {region.region_name}
                            </option>
                        ))}
                    </select>
                    {errors?.region && <p className="error text-red-500 text-sm mt-2">{errors?.region?.message}</p>}
                </div>

                {/* Category select */}
                <div className="mb-4">
                    <label className="block text-sm font-bold mb-2" htmlFor="category">
                        {t("create-ad.category")}
                    </label>
                    <select
                        id="category"
                        name="category"
                        className="select select-bordered w-full"
                        {...register("category", {
                            onChange: (e) => {
                                handleMainCategoryChange(e)
                            }
                        })}

                    >
                        <option value="">{t("create-ad.select-category")}</option>
                        {translatedCategories?.map((category) => (
                            <option key={category.category_id} value={category.category_id}>
                                {category.category_name}
                            </option>
                        ))}
                    </select>
                    {errors?.category && <p className="error text-red-500 text-sm mt-2">{errors?.category?.message}</p>}

                </div>

                {/* Sub-category select */}
                {selectedCategory && selectedCategory !== "" && (
                    <div className="mb-4">
                        <label className="block text-sm font-bold mb-2" htmlFor="subcategory">
                            {t("create-ad.sub-category")}
                        </label>
                        <select
                            id="subcategory"
                            name="subcategory"
                            className="select select-bordered w-full"
                            {...register("subcategory")}
                        >
                            <option value="">{t("create-ad.select-subcategory")}</option>
                            {renderSubCategoryOptions()}
                        </select>
                        {errors?.subcategory && <p className="error text-red-500 text-sm mt-2">{errors?.subcategory?.message}</p>}
                    </div>
                )}

                <div className="flex items-center justify-start">
                    <SubmitButton isSubmitting={isSubmitting} isValid={isValid} />
                </div>
            </form>
        </div>

    );
}
