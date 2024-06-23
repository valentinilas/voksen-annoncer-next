'use client';


import { useTranslations } from 'next-intl';
import { useFormState } from 'react-dom';
import { SubmitButton } from "./submit-button";
import { submitPost } from "@/lib/action-submit-post";
import translateArray from '@/utils/translations/translate-array';
import { useState } from 'react';

import { useFormik } from 'formik';
import * as Yup from 'yup';


export default function NewPost({ categories, regions }) {
    const t = useTranslations();
    const [state, formAction] = useFormState(submitPost, { error: null });



    const validationSchema = Yup.object({
        title: Yup.string()
            .required(t("validation.required"))
            .max(160, t("validation.title-length")),
        description: Yup.string()
            .required(t("validation.required")),
        images: Yup.mixed()
            .test('fileSize', t("create-ad.image-size"), (value) => {
                if (!value || !value.length) return true; // not required
                return Array.from(value).every(file => file.size <= 2 * 1024 * 1024); // 2MB
            })
            .test('fileType', t("create-ad.image-type"), (value) => {
                if (!value || !value.length) return true; // not required
                return Array.from(value).every(file => file.type.startsWith('image/'));
            })
            .test('fileCount', t("create-ad.image-length"), (value) => {
                if (!value || !value.length) return true; // not required
                return value.length <= 12;
            }),
        region: Yup.string()
            .required(t("validation.required")),
        category: Yup.string()
            .required(t("validation.required")),
        subCategory: Yup.string()
            .required(t("validation.required")),
    });

    const timeout = ms => new Promise(resolve => setTimeout(resolve, ms));

    const formik = useFormik({
        initialValues: {
            title: '',
            description: '',
            images: null,
            region: '',
            category: '',
            subCategory: '',
        },
        validationSchema: validationSchema,
        onSubmit: async (values) => {
        },
    });

    const [selectedCategory, setSelectedCategory] = useState('');



    const handleMainCategoryChange = (e) => {
        setSelectedCategory(e.target.value);
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
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.title}
                    />
                    {formik.touched.title && formik.errors.title ? (
                        <div className="text-red-500 text-sm">{formik.errors.title}</div>
                    ) : null}
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
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.description}
                    ></textarea>
                    {formik.touched.description && formik.errors.description ? (
                        <div className="text-red-500 text-sm">{formik.errors.description}</div>
                    ) : null}
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
                        onChange={(event) => {
                            formik.setFieldValue("images", event.currentTarget.files);
                        }}
                    />
                    {formik.touched.images && formik.errors.images ? (
                        <div className="text-red-500 text-sm">{formik.errors.images}</div>
                    ) : null}
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
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.region}
                    >
                        <option value="">{t("create-ad.select-region")}</option>
                        {regions?.map((region) => (
                            <option key={region.id} value={region.id}>
                                {region.region_name}
                            </option>
                        ))}
                    </select>
                    {formik.touched.region && formik.errors.region ? (
                        <div className="text-red-500 text-sm">{formik.errors.region}</div>
                    ) : null}
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
                        onChange={(e) => {
                            handleMainCategoryChange(e);
                            formik.handleChange(e);
                        }}
                        onBlur={formik.handleBlur}
                        value={formik.values.category}
                    >
                        <option value="">{t("create-ad.select-category")}</option>
                        {translatedCategories?.map((category) => (
                            <option key={category.category_id} value={category.category_id}>
                                {category.category_name}
                            </option>
                        ))}
                    </select>
                    {formik.touched.category && formik.errors.category ? (
                        <div className="text-red-500 text-sm">{formik.errors.category}</div>
                    ) : null}
                </div>

                {/* Sub-category select */}
                {selectedCategory && (
                    <div className="mb-4">
                        <label className="block text-sm font-bold mb-2" htmlFor="subCategory">
                            {t("create-ad.sub-category")}
                        </label>
                        <select
                            id="subCategory"
                            name="subCategory"
                            className="select select-bordered w-full"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.subCategory}
                        >
                            <option value="">{t("create-ad.select-subcategory")}</option>
                            {renderSubCategoryOptions()}
                        </select>
                        {formik.touched.subCategory && formik.errors.subCategory ? (
                            <div className="text-red-500 text-sm">{formik.errors.subCategory}</div>
                        ) : null}
                    </div>
                )}

                <div className="flex items-center justify-between">
       
                    <SubmitButton />
                </div>
            </form>
        </div>

    );
}
