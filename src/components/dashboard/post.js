"use client";
import { CalendarDaysIcon, TagIcon, MapPinIcon, EllipsisVerticalIcon } from "@heroicons/react/24/outline";

import { formatDate } from "@/utils/formatter/format-date";
import Link from "next/link";
import { useRef } from "react";
import Label from "../label/label";
import { useTranslations } from "next-intl";
import DefaultImage from "../default-image/default-image";
import ConfirmationModal from "../confirmation-modal/confirmation-modal";
import { handleAdminDeleteRow } from "@/lib/handleAdminDeleteRow";
import Image from "next/image";

export default function Post({ ad }) {
    const t = useTranslations();

    const dialog = useRef(); // we use forward ref in the real dialog

    function showModal() {
        dialog.current.open();
    }

    function hideModal() {
        dialog.current.close();
    }

    async function confirmDelete(uuid) {
        await handleAdminDeleteRow(uuid);
        dialog.current.close();

    }


    function truncateText(text, maxLength) {
        if (text.length <= maxLength) {
            return text;
        }
        return text.substring(0, maxLength) + '...';
    }


    const { slug, uuid, title, description, ad_images, created_at, is_approved, ad_categories, ad_sub_categories, regions } = ad;

    return (
        <>
            <ConfirmationModal ref={dialog} onCancel={() => { hideModal() }} onConfirm={() => confirmDelete(uuid)} />

            <li key={uuid} className="bg-base-100 p-5 my-2 rounded-box ">

                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 ">

                    <div className="col-span-1 md:col-span-12 flex justify-between items-center border-b pb-5  border-base-300">

                        <Label type={is_approved ? 'success' : 'warning'}>{is_approved ? `${t('ads.approved')}` : `${t('ads.pending-approval')}`}</Label>

                        <div className="dropdown dropdown-end">
                            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle"><EllipsisVerticalIcon className="size-5 " /></div>
                            <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
                                <li><button onClick={() => showModal()}>{t("ads.delete")}</button></li>
                            </ul>
                        </div>
                    </div>
                    <div className="col-span-1 md:col-span-8 ">



                        <Link className="block" href={`/posts/${slug}`}><h4 className="font-bold text-lg mb-4 truncate">{title}</h4></Link>
                        <Link className="block" href={`/posts/${slug}`}> <p className="text-ellipsis overflow-hidden">{truncateText(description, 300)}</p></Link>

                    </div>
                    <div className="col-span-1 md:col-span-4">

                        <Link className="block" href={`/posts/${slug}`}>{ad_images.length > 0 ? <Image src={ad_images[0].image_url} className="rounded-box w-full object-cover aspect-square bg-neutral border-base-100" alt={title} width={300} height={300} /> : <DefaultImage />}</Link>
                    </div>

                </div>


                <div className="border-t pt-5 mt-5 border-base-300  flex  flex-wrap gap-2">
                    <Label Icon={CalendarDaysIcon}>{formatDate(created_at)}</Label>
                    <Label Icon={MapPinIcon}><Link className="link link-hover"  href={`/location/${regions?.slug}`}>{regions?.region_name}</Link></Label>
                    <Label Icon={TagIcon}><Link className="link link-hover"  href={`/category/${ad_categories?.slug}`}> {t(`categories.${ad_categories?.category_name}`)}</Link></Label>
                    <Label Icon={TagIcon}><Link className="link link-hover" href={`/category/${ad_sub_categories?.slug}`}>{t(`subcategories.${ad_sub_categories?.sub_category_name}`)}</Link></Label>

                </div>



            </li>
        </>

    );
}
