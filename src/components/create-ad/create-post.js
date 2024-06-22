'use client';


import { useTranslations } from 'next-intl';
import { useFormState } from 'react-dom';
import { SubmitButton } from "./submit-button";
import { submitPost } from "@/lib/action-submit-post";
import translateArray from '@/utils/translations/translate-array';
import { useState } from 'react';


export default function NewPost({ categories, regions }) {
    const t = useTranslations();
    const [state, formAction] = useFormState(submitPost, { error: null });

    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedSubCategory, setSelectedSubCategory] = useState('');
    const [selectedRegion, setSelectedRegion] = useState('');


    const handleMainCategoryChange = (e) => {
        setSelectedCategory(e.target.value);
        setSelectedSubCategory('all'); // Reset sub-category selection
    };

    // Handle change in sub category selection
    const handleSubCategoryChange = (e) => {
        setSelectedSubCategory(e.target.value);
    };

    // Render options for sub-categories based on selected main category
    const renderSubCategoryOptions = () => {
        const mainCategory = categories.find(cat => cat.category_id === Number(selectedCategory));
        if (mainCategory && mainCategory.ad_sub_categories) {
            const subCategories = mainCategory.ad_sub_categories || [];

            const translatedSubCategories = translateArray(t, 'subcategories', 'sub_category_name', subCategories);
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

        <div className="bg-base-200 p-5  rounded-box shadow-sm">
            <h2 className="text-2xl font-bold mb-4 dark:text-zinc-400">Create Ad</h2>
            <form action={formAction}>
                {state.error && <p className="error text-red-500 text-sm">{state.error}</p>}
                {state.success && <p className="error text-green-500 text-sm">Success</p>}


                <div className="mb-4">
                    <label className="block  text-sm font-bold mb-2" htmlFor="title">
                        {t("create-ad.title")}
                    </label>
                    <input
                        id="title"
                        name="title"
                        type="text"
                        className="input input-bordered w-full"

                    />

                </div>
                <div className="mb-4">
                    <label className="block  text-sm font-bold mb-2" htmlFor="description">
                        {t("create-ad.description")}
                    </label>
                    <textarea
                        id="description"
                        name="description"
                        rows="7"
                        className="textarea textarea-bordered w-full"

                    ></textarea>

                </div>
                <div className="mb-4">
                    <label className="block  text-sm font-bold mb-2" htmlFor="images">
                        {t("create-ad.upload-images")}
                    </label>
                    <input
                        id="images"
                        name="images"
                        type="file"
                        multiple
                        className="file-input file-input-bordered w-full"
                    // onChange={handleFileChange}
                    />


                </div>
                <div className="mb-4">
                    <label className="block  text-sm font-bold mb-2" htmlFor="region">
                        {t("create-ad.region")}
                    </label>

                    <select
                        id="region"
                        name="region"
                        className="select select-bordered w-full"

                    >
                        <option value="">{t("create-ad.select-region")}</option>
                        {regions?.map((region) => (
                            <option key={region.id} value={region.id}>
                                {region.region_name}
                            </option>
                        ))}

                    </select>



                </div>

                <div className="mb-4">
                    <label className="block  text-sm font-bold mb-2" htmlFor="region">
                        {t("create-ad.category")}
                    </label>

                    <select
                        id="category"
                        name="category"
                        className="select select-bordered w-full"

                        onChange={handleMainCategoryChange}
                    >
                        <option value=""> {t("create-ad.select-category")}</option>
                        {translatedCategories?.map((category) =>

                            <option key={category.category_id} value={category.category_id}>
                                {category.category_name}
                            </option>

                        )}
                    </select>



                </div>
                {selectedCategory && (
                    <div className="mb-4">
                        <label className="block  text-sm font-bold mb-2" htmlFor="sub-category">
                            {t("create-ad.sub-category")}
                        </label>
                        <select
                            id="sub-category"
                            name="sub-category"
                            className="select select-bordered w-full"

                        >
                            <option value="">{t("create-ad.select-subcategory")}</option>
                            {renderSubCategoryOptions()}
                        </select>
                    </div>
                )}

                <div className="flex items-center justify-between">
                    <SubmitButton />
                </div>
            </form>
        </div>

    );
}
