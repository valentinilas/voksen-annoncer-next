'use client';

import { useEffect } from 'react';
import { incrementPageViews } from "@/lib/increment-views";

export default function ViewIncrementer({ slug }) {
    useEffect(() => {
        incrementPageViews(slug);
    }, [slug]);

    return; // This component doesn't render anything
}