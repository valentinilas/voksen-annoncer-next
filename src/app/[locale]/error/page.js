"use client";
import { ExclamationCircleIcon } from "@heroicons/react/24/outline";
import { useSearchParams } from 'next/navigation';

export default function ErrorPage() {
  const searchParams = useSearchParams();
  const message = searchParams.get('message');

  return (
    <div text-center>
     
      <div role="alert" class="alert alert-error">
      <ExclamationCircleIcon className="size-6 " />
        <span>Sorry, something went wrong: {message}</span>
      </div>
    </div>
  );
}