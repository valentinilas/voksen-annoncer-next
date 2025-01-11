'use client';

import React from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import Link from 'next/link';
import Image from 'next/image';
import DefaultImage from '../default-image/default-image';
import {
  PrevButton,
  NextButton,
  usePrevNextButtons
} from './embla-buttons';

export function FeaturedAds({ featuredAds = [] }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: 'start',
    containScroll: 'trim',
    loop: false,
  });

  const {
    prevBtnDisabled,
    nextBtnDisabled,
    onPrevButtonClick,
    onNextButtonClick
  } = usePrevNextButtons(emblaApi)

  return (
    <>
    <h2 className="text-sm mb-4">Dagens fremhævede annoncer</h2>
    <div className="embla overflow-hidden mb-10" ref={emblaRef}>
      <div className="embla__container grid grid-flow-col xl:auto-cols-[25%] md:auto-cols-[50%] lg:auto-cols-[33.33%] auto-cols-[100%] min-h-10">
        {featuredAds.map((ad, index) => {
          const { ad_images, title } = ad;
          return (

            <div key={index} className="embla__slide mr-2">
              {/* <img src={ad.uui} alt={ad.title} /> */}
              <Link className="embla__slide-wrapper flex h-full shadow-md bg-base-200 hover:bg-base-100  px-4 py-4 gap-4 items-center rounded-box" href={`/posts/${ad.slug}`}>
                <div className="size-16 shrink-0">
                  {ad_images?.length > 0 ? <Image src={ad_images[0]?.image_url} width={64} height={64} className="rounded-lg w-full object-cover aspect-square bg-neutral border-base-100" alt="" /> : <DefaultImage iconSize='size-6' />}
                </div>
                <div>
                  {`${ad.title.slice(0, 40)}...`}
                </div>


              </Link>
            </div>
          )
        })}
      </div>
      <div className="embla__controls flex justify-center gap-2 mt-4">
        <PrevButton onClick={onPrevButtonClick} disabled={prevBtnDisabled} className="hover:text-cherry-500 rounded-full disabled:opacity-25" />
        <NextButton onClick={onNextButtonClick} disabled={nextBtnDisabled} className="hover:text-cherry-500 rounded-full disabled:opacity-25" />


      </div>
    </div>
    </>
  )

}
