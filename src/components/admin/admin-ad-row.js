"use client"

import Link from "next/link";
import { useRef } from "react";
import ConfirmationModal from "../confirmation-modal/confirmation-modal";

import { handleAdminDeleteRow } from "@/lib/handleAdminDeleteRow";
import { handleAdminAdApproval } from "@/lib/handleAdminAdApproval";

const AdRow = ({ ad, index }) => {


    function truncateText(text, maxLength) {
        if (text.length <= maxLength) {
            return text;
        }
        return text.substring(0, maxLength) + '...';
    }



    // Toggle ad approval status
    const toggleAdApproval = async (ad) => {
       await handleAdminAdApproval(ad)
    };


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

    return (
        <tr key={ad.uuid} className="hover">
            <th>{index}</th>
            <td>{ad.uuid}</td>
            <td>{ad.profiles?.username}</td>
            <td>{truncateText(ad.title, 20)}</td>
            <td><Link className="btn btn-neutral" href={`/posts/${ad.slug}`}>See Ad</Link></td>
            <td>
                <input
                    type="checkbox"
                    className="toggle toggle-success"
                    checked={ad.is_approved}
                    onChange={() => toggleAdApproval(ad)}
                />
            </td>
            <td>
                <button className="btn btn-error" onClick={() => showModal()}>Delete</button>
                <ConfirmationModal ref={dialog} onCancel={() => { hideModal() }} onConfirm={() => confirmDelete(ad.uuid)} />
            </td>


        </tr>
    );
};

export default AdRow;
