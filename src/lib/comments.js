"use server";
import { createClient } from "@/utils/supabase/server";
import { createServerValidationSchema } from "@/components/ad-page/ad-comment-validation-schema-server";
import { getTranslations } from 'next-intl/server';

export const fetchComments = async (post_id) => {
    const supabase = createClient();

    try {
        const { data, error } = await supabase
            .from('ad_comments')
            .select('*, profiles(*)')
            .eq('ad_id', post_id)
            .order('created_at', { ascending: false });

        if (error) {
            throw new Error(error.message);
        }

        // Serialize the data to ensure it's safe to pass to client components
        const serializedData = JSON.parse(JSON.stringify(data));
        return { data: serializedData, commentsError: null };
    } catch (error) {
        console.error('Error fetching comments:', error);
        return { data: null, commentsError: error.message };
    }
};



export async function addComment(post_id, content, parent_comment_id = null) {
    const supabase = createClient();
    const t = await getTranslations();
    const validationSchema = createServerValidationSchema(t);


    const data = {
        newComment: content,
    }

    // Validate the data
    try {
        await validationSchema.validate(data, { abortEarly: false });
    } catch (validationError) {
        console.error('Validation error:', validationError.errors);
        // return { error: validationError.errors };
        throw new Error(validationError.errors.join(", "));
    }


    try {
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            throw new Error('User not authenticated');
        }

        const { data: commentData, error: commentError } = await supabase
            .from('ad_comments')
            .insert({
                user_id: user.id,
                ad_id: post_id,
                content,
                parent_comment_id
            })
            .select()
            .single();

        if (commentError) {
            throw new Error(commentError.message);
        }

        // Fetch the user's profile
        const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();

        if (profileError) {
            throw new Error(profileError.message);
        }

        // Combine comment and profile data
        const fullCommentData = {
            ...commentData,
            profiles: profileData
        };

        // Serialize the data before returning
        return JSON.parse(JSON.stringify(fullCommentData));
    } catch (error) {
        console.error('Error adding comment:', error);
        throw error;
    }
}