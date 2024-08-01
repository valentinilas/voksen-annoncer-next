'use client';

import { useEffect } from 'react';
import PhotoSwipeLightbox from 'photoswipe/lightbox';
import 'photoswipe/style.css';

import {MagnifyingGlassPlusIcon} from "@heroicons/react/24/outline";
import Image from "next/image";

export default function SimpleGallery(props) {
    useEffect(() => {
        let lightbox = new PhotoSwipeLightbox({
            gallery: '#' + props.galleryID,
            children: 'a',
            pswpModule: () => import('photoswipe'),
        });
        lightbox.init();

        return () => {
            lightbox.destroy();
            lightbox = null;
        };
    }, []);

    return (
        <div className="pswp-gallery grid md:grid-cols-2 lg:grid-cols-4 2xl:grid-cols-4 gap-4 mt-10 mb-auto" id={props.galleryID}>
            {props.images.map((image, index) => (
                <a
                    className="relative group"
                    href={image.largeURL}
                    data-pswp-width={image.width}
                    data-pswp-height={image.height}
                    key={props.galleryID + '-' + index}
                    target="_blank"
                    rel="noreferrer"
                >
                    <MagnifyingGlassPlusIcon className="opacity-0 group-hover:opacity-100 size-8 text-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"/>
                    <Image className="rounded-2xl  w-full object-cover aspect-square border-solid border-2 border-transparent group-hover:border-cherry-600 transition-colors" src={image.thumbnailURL} alt="" width={300} height={300} />
                </a>
            ))}
        </div>
    );
}


