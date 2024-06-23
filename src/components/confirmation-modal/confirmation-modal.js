"use client";

import Button from "../button/button";
import { useRef, forwardRef, useImperativeHandle } from "react";
import { useTranslations } from "next-intl";

const ConfirmationModal = forwardRef(function ConfirmationModal({ onCancel, onConfirm }, ref) {
const t =  useTranslations();

  const dialog = useRef()

  useImperativeHandle(ref, () => {
    return {
      open() {
        dialog.current.showModal();
      },
      close() {
        dialog.current.close();
      }
    }
  })

  return (
    <dialog ref={dialog} className="p-10 bg-base-100 shadow-xl rounded-box backdrop:bg-black/20">
      <h3 className="text-xl mb-3 text-center">{t("confirm.are-you-sure")}</h3>
      {/* <p>{message}</p> */}
      <div className="flex justify-center mt-10 gap-2">
        <Button variant="secondary" onClick={onCancel}>{t("confirm.cancel")}</Button>
        <Button variant="primary" onClick={onConfirm}>{t("confirm.yes")}</Button>
      </div>
    </dialog>
  );
});

export default ConfirmationModal;