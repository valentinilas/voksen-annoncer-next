"use client";

import { useEffect, useState } from 'react';
import { fetchPostAnalytics } from "@/lib/fetch-post-analytics";

export default function PostAnalytics({ slug }) {
    const [viewCount, setViewCount] = useState(null);

    useEffect(() => {
        async function getAnalytics() {
            try {
                const analytics = await fetchPostAnalytics(slug);
                setViewCount(analytics?.data?.view_count || 0);
            } catch (error) {
                console.error("Error fetching post analytics:", error);
            }
        }

        getAnalytics();
    }, [slug]);

    if (viewCount === null) return null; // or a loading indicator

    return <span>{viewCount}</span>;
}