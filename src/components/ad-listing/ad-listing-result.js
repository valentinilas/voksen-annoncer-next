import Button from "@/components/button/button";
import Link from "next/link";
import Label from "@/components/label/label";
import { formatDate } from "@/utils/formatter/format-date";
import { CalendarDaysIcon, TagIcon, MapPinIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { useTranslations } from 'next-intl';
import Image from "next/image";

import DefaultImage from "@/components/default-image/default-image";

export default function AdListingResult({ data }) {
    const t = useTranslations();


    const {slug = "", uuid = "", title = "", created_at = null, description = "", ad_images = [], regions = [], ad_categories = [], ad_sub_categories = [] } = data;


    function truncateText(text, maxLength) {
        if (text.length <= maxLength) {
            return text;
        }
        return text.substring(0, maxLength) + '...';
    }


    return (<div>
        <div className="bg-base-100 p-5 my-2 rounded-box shadow-sm">
            {/* Card main content */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
                <div className="result-image col-span-1 md:col-span-3">
                    <Link href={`/posts/${slug}`}>{ad_images.length > 0 ? <Image src={ad_images[0].image_url} width={300} height={300}  className="rounded-box w-full object-cover aspect-square bg-neutral border-base-100" alt={title} /> : <DefaultImage />}</Link>
                </div>
                <div className="result-text col-span-1 md:col-span-9  flex flex-col justify-start items-start gap-2">
                    <Link href={`/posts/${slug}`}><h2 className=" text-2xl mb-4">{title}</h2></Link>
                    <Link href={`/posts/${slug}`}><div>{truncateText(description, 350)}</div></Link>
                </div>

            </div>
            {/* Details */}
            <div>
                <div className="border-t border-base-300 flex justify-between mt-5 pt-5">
                    <div className="flex gap-2 items-center flex-wrap">
                        <Label Icon={CalendarDaysIcon}>{formatDate(created_at)}</Label>
                        <Label Icon={MapPinIcon}><Link className="link link-hover" href={`/location/${regions?.slug}`}>{regions?.region_name}</Link></Label>
                        <Label Icon={TagIcon}><Link className="link link-hover" href={`/category/${ad_categories?.slug}`}>{t(`categories.${ad_categories?.category_name}`)}</Link></Label>
                        <Label Icon={TagIcon}><Link className="link link-hover" href={`/category/${ad_sub_categories?.slug}`}>{t(`subcategories.${ad_sub_categories?.sub_category_name}`)}</Link></Label>
                    </div>
                    <Button Icon={ChevronRightIcon} iconDirection="right" className="self-start hidden md:inline-flex" to={`/posts/${slug}`}>{t("ads.Details")}</Button>
                </div>
            </div>




        </div>
    </div>)
}