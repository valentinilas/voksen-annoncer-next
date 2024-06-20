import { PhotoIcon } from "@heroicons/react/24/outline";
export default function DefaultImage() {
    return (
        <div className="mb-2 rounded-box w-full object-cover aspect-square bg-neutral border-base-100 relative group">
            <PhotoIcon className="text-neutral-content size-16 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
        </div>
    )
}

