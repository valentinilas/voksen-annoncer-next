'use client'

import { useState } from 'react'
import { addComment } from '@/lib/comments'
import { useTranslations } from 'next-intl';

import { useForm } from 'react-hook-form';
import { yupResolver } from "@hookform/resolvers/yup"
import { createValidationSchema } from './ad-comment-validation-schema'

export default function CommentForm({ adId, onCommentAdded }) {
    const t = useTranslations();
    const validationSchema = createValidationSchema(t);

    // const [content, setContent] = useState('');
    const [serverValidationError, setServerValidationError] = useState({ error: null });


    // React Hook Form
    const {
        handleSubmit,
        register,
        reset,
        formState: { errors, isSubmitting, isValid },
    } = useForm({
        mode: "onChange",
        resolver: yupResolver(validationSchema)
    });

    const onSubmit = handleSubmit(async data => {

        try {
            const newComment = await addComment(adId, data.newComment)
            onCommentAdded(newComment) // Update the parent component's state
            reset(); // Reset the form after successful submission
            setServerValidationError({ error: null })
        } catch (error) {
            setServerValidationError({ error: error.message })
        }
        

    });




    return (
        <form onSubmit={onSubmit} className="mb-5">

            {serverValidationError.error && <div><p className="error text-red-500 text-sm mt-2">{serverValidationError.error}</p></div>}

            <textarea
                name="newComment"
                id="newComment"
                className="textarea textarea-bordered w-full"
                placeholder={t("comments.write-comment")}
                {...register("newComment")}
            />
            {errors?.newComment && <p className="error text-red-500 text-sm mt-2">{errors?.newComment?.message}</p>}
            <button type="submit" className="btn btn-primary mt-2"
                disabled={isSubmitting || !isValid}
            >
                {t("comments.submit")}
            </button>
        </form>
    )
}