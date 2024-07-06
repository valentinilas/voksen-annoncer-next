'use client';


import { useTranslations } from 'next-intl';
import { SubmitButton } from "./submit-button";
import { submitPost } from '@/lib/action-submit-post';
import translateArray from '@/utils/translations/translate-array';
import { useState } from 'react';

import { useForm } from 'react-hook-form';
import { yupResolver } from "@hookform/resolvers/yup"
import { createValidationSchema } from './validation-schema';


export default function NewPost({ categories, regions }) {
    const [selectedCategory, setSelectedCategory] = useState('');
    const [serverValidationError, setServerValidationError] = useState({ error: null });


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
        resolver: yupResolver(validationSchema)
    });

    console.log(errors);

    const onSubmit = handleSubmit(async data => {
        console.log("data", data);

        const formData = new FormData();
        // Append text fields
        formData.append('title', data.title);
        formData.append('description', data.description);
        formData.append('region', data.region);
        formData.append('category', data.category);
        formData.append('subcategory', data.subcategory);

        // Append files
        if (data.images) {
            for (let i = 0; i < data.images.length; i++) {
                formData.append('images', data.images[i]);
            }
        }

        const response = await submitPost(formData);

        if (response?.error) {
            console.log(response.error);
            setServerValidationError({ error: response.error })
        } else {
            reset();
        }
    });







    const handleMainCategoryChange = (e) => {
        setSelectedCategory(e.target.value);
        setValue('subcategory', ''); // This resets the form value for subcategory
    };


    // const selectedCategory = watch("category");



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
            <h2 className="text-2xl font-bold mb-4 ">{t("navigation.create-ad")}</h2>
            <form
                onSubmit={onSubmit}
                encType="multipart/form-data"
            // action={formAction}
            >
                {serverValidationError.error && <p className="error text-red-500 text-sm mt-2">{serverValidationError.error}</p>}
                {/* {state.error && <p className="error text-red-500 text-sm mt-2">{state.error}</p>} */}

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

                {/* Images input */}
                <div className="mb-4">
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
                </div>

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
