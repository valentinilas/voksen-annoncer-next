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
import { useTranslations } from 'next-intl';

export function FeaturedAds({ featuredAds = [], vertical = true }) {

  const t = useTranslations();

  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: 'start',
    containScroll: 'trim',
    loop: false,
    axis: vertical ? 'y' : 'x'
  });

  const {
    prevBtnDisabled,
    nextBtnDisabled,
    onPrevButtonClick,
    onNextButtonClick
  } = usePrevNextButtons(emblaApi)

  if (!featuredAds || featuredAds.length === 0) {
    return null;
  }
  return (
    <>
      <h2 className="text-sm mb-4">{t('featured.headline')}</h2>
      <div className="embla overflow-hidden mb-10" ref={emblaRef}>
        <div className={`embla__container flex ${vertical ? 'flex-col h-[500px]' : ''}`}>
          {featuredAds.map((ad, index) => {
            const { ad_images, title } = ad;
            return (

              <div key={index} className={`embla__slide grow-0 shrink-0  ${vertical ? 'pb-2  basis-1/4': 'pr-2 basis-full md:basis-1/2 lg:basis-1/3 xl:basis-1/4'}`}>
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

      </div>
      <div className="embla__controls flex justify-center gap-2 mt-4">
        <PrevButton onClick={onPrevButtonClick} disabled={prevBtnDisabled} className="hover:text-cherry-500 rounded-full disabled:opacity-25" />
        <NextButton onClick={onNextButtonClick} disabled={nextBtnDisabled} className="hover:text-cherry-500 rounded-full disabled:opacity-25" />


      </div>
    </>
  )

}
