import { useTranslations } from "next-intl";
import Label from "../label/label";
import { formatDate } from "@/utils/formatter/format-date";
import { CalendarDaysIcon, TagIcon, MapPinIcon } from "@heroicons/react/24/outline";
import SimpleGallery from "./ad-gallery";
import PostAnalytics from "./ad-analytics";
import { Link } from "@/i18n/routing";



export default function AdDetail({ data, slug }) {



    const { title, description, created_at, regions, ad_categories, ad_sub_categories, ad_images } = data;
    const t = useTranslations();

    const galleryImages = ad_images.map(image => {
        return {
            ...image,
            largeURL: image.image_url.split('?')[0],
            thumbnailURL: image.image_url,
            width: image.image_width,
            height: image.image_height
        }
    })



    return (
        <>
            <div className="result-tex">

                <h1 className="font-bold text-2xl mb-4">{title}</h1>
                <div><pre className="font-sans whitespace-pre-wrap">{description}</pre></div>
            </div>


            {galleryImages.length > 0 ? <SimpleGallery
                galleryID="my-test-gallery"
                images={galleryImages}

            /> : null}

            <div className="border-t pt-5 mt-5 border-base-300  flex flex-wrap gap-2 ">
                {t("ads.views")}: <PostAnalytics slug={slug} />
            </div>

            <div className="border-t pt-5 mt-5 border-base-300  flex flex-wrap gap-2 ">
                <Label Icon={CalendarDaysIcon}>{formatDate(created_at)}</Label>
                <Label Icon={MapPinIcon}><Link className="link link-hover" href={`/location/${regions?.slug}`}>{regions?.region_name}</Link></Label>
                <Label Icon={TagIcon}><Link className="link link-hover" href={`/category/${ad_categories?.slug}`}>{t(`categories.${ad_categories?.category_name}`)}</Link></Label>
                <Label Icon={TagIcon}><Link className="link link-hover" href={`/category/${ad_sub_categories?.slug}`}>{t(`subcategories.${ad_sub_categories?.sub_category_name}`)}</Link></Label>
            </div>


            {/* <Spotlight /> */}
        </>
    );
}