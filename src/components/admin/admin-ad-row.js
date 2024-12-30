"use client"
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef } from "react";
import ConfirmationModal from "../confirmation-modal/confirmation-modal";
import { handleAdminDeleteRow } from "@/lib/handleAdminDeleteRow";
import { handleAdminAdApproval } from "@/lib/handleAdminAdApproval";

const AdRow = ({ ad: initialAd, index }) => {
    const router = useRouter();
    const [ad, setAd] = useState(initialAd);
    const [isUpdating, setIsUpdating] = useState(false);
    
    function truncateText(text, maxLength) {
        if (text.length <= maxLength) {
            return text;
        }
        return text.substring(0, maxLength) + '...';
    }

    // Toggle ad approval status with optimistic update
    const toggleAdApproval = async () => {
        setIsUpdating(true);
        // Optimistically update the UI
        setAd(prevAd => ({
            ...prevAd,
            is_approved: !prevAd.is_approved
        }));

        try {
            const result = await handleAdminAdApproval(ad);
            if (result.error) {
                // Revert on error
                setAd(prevAd => ({
                    ...prevAd,
                    is_approved: !prevAd.is_approved
                }));
                console.error(result.error);
            }
            // Force a refresh of the page data
            router.refresh();
        } catch (error) {
            // Revert on error
            setAd(prevAd => ({
                ...prevAd,
                is_approved: !prevAd.is_approved
            }));
            console.error('Error updating approval status:', error);
        } finally {
            setIsUpdating(false);
        }
    };

    const dialog = useRef();

    function showModal() {
        dialog.current.open();
    }

    function hideModal() {
        dialog.current.close();
    }

    async function confirmDelete(uuid) {
        await handleAdminDeleteRow(uuid);
        dialog.current.close();
        router.refresh(); // Refresh the page after delete
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
                    onChange={toggleAdApproval}
                    disabled={isUpdating}
                />
            </td>
            <td>
                <button className="btn btn-error" onClick={showModal}>Delete</button>
                <ConfirmationModal ref={dialog} onCancel={hideModal} onConfirm={() => confirmDelete(ad.uuid)} />
            </td>
        </tr>
    );
};

export default AdRow;