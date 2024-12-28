import { PhotoIcon } from "@heroicons/react/24/outline";
export default function DefaultImage({ width = 'w-full', height = 'aspect-square', rounded = 'rounded-box', iconSize = 'size-16' }) {
    return (
        <div className={`mb-2 ${rounded} ${width} ${height} object-cover bg-neutral border-base-100 relative group`}>
          <PhotoIcon className={`text-neutral-content ${iconSize} absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2`} />
        </div>
      );
}

