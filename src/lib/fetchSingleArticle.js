import { createClient } from "@/utils/supabase/server";

export const fetchSingleArticle = async (slug) => {

    const supabase = createClient();

    try {
        const { data: article, error } = await supabase
            .from('articles')
            .select(`*,  profiles(*)`)
            .eq('slug', slug)
            .maybeSingle();

        if (error) {
            throw error;
        }
       

        return {article: article, articleError:null}


    } catch (error) {
        console.error('Error fetching data:', error);
        return {article:{}, articleError:error}
    }
};

