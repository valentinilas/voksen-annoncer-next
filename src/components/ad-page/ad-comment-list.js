'use client'

import { useState, useEffect } from 'react'
import { fetchComments, addComment } from '@/lib/comments';
import { formatCommentDate } from '@/utils/formatter/format-comment-date';
import CommentForm from './ad-comment-form';
import { useTranslations } from 'next-intl';
import Image from "next/image";
import DefaultImage from '../default-image/default-image';

export default function CommentList({ initialComments, ad, adId, user }) {
  const t = useTranslations("comments");
  const [comments, setComments] = useState(initialComments)
  const [replyContents, setReplyContents] = useState({})
  const [serverValidationError, setServerValidationError] = useState({ error: null });

  useEffect(() => {
    const intervalId = setInterval(async () => {
      const { data: updatedComments } = await fetchComments(adId)
      setComments(updatedComments);
    }, 100000)

    return () => clearInterval(intervalId)
  }, [adId])

  if (!user) {
    return <p>{t("not-logged-in")}</p>;
  }

  const { id: currentUserId } = user;
  const isAdmin = user?.is_admin
  const isAdOwner = ad.user_id === currentUserId;

  const handleReplyChange = (commentId, content) => {
    setReplyContents(prev => ({ ...prev, [commentId]: content }))
  }

  const submitReply = async (parentCommentId) => {
    try {
      const replyContent = replyContents[parentCommentId] || ''
      const newComment = await addComment(adId, replyContent, parentCommentId)
      // Add new comment at the beginning of the array
      setComments(prevComments => [newComment, ...prevComments])
      setReplyContents(prev => ({ ...prev, [parentCommentId]: '' }))
      setServerValidationError({ error: null })
    } catch (error) {
      setServerValidationError({ error: error.message })
    }
  }

  const addNewComment = (newComment) => {
    // Add new comment at the beginning of the array
    setComments(prevComments => [newComment, ...prevComments])
  }

  const canViewComment = (comment) => {
    if (isAdmin || isAdOwner || comment.user_id === currentUserId) {
      return true;
    }

    const isPartOfUserThread = (commentId) => {
      const parentComment = comments.find(c => c.id === commentId);
      if (!parentComment) return false;
      if (parentComment.user_id === currentUserId) return true;
      return parentComment.parent_comment_id ? isPartOfUserThread(parentComment.parent_comment_id) : false;
    };

    return isPartOfUserThread(comment.parent_comment_id);
  };

  // Helper function to check if user has an existing thread open, if yes don't show the initial comment box anymore.
  const userHasExistingThread = () => {
    return comments.some(comment => 
      comment.parent_comment_id === null && 
      comment.user_id === currentUserId
    );
  };

  const findLastCommentInThread = (rootCommentId) => {
    const threadComments = comments
      .filter(c => {
        let currentId = c.id;
        while (currentId) {
          const current = comments.find(comment => comment.id === currentId);
          if (!current) break;
          if (current.id === rootCommentId) return true;
          currentId = current.parent_comment_id;
        }
        return false;
      })
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    return threadComments[0]?.id;
  };

  const renderComment = (comment, depth = 0) => {
    if (!canViewComment(comment)) return null;

    const { avatar_url, username } = comment.profiles;
    const subComments = comments.filter(c => c.parent_comment_id === comment.id);
    const rootCommentId = comment.parent_comment_id === null ? comment.id : comment.parent_comment_id;
    const isLastInThread = comment.id === findLastCommentInThread(rootCommentId);

    return (
      <div key={comment.id} className={comment.parent_comment_id === null ? "bg-base-100 p-5 rounded-box border border-base-300 shadow-lg my-5" : ''}>
        <div className="flex items-center space-x-3 mb-5">
          <div className="self-start shrink-0">
            {avatar_url ? (
              <Image src={avatar_url} alt={username} width={40} height={40} className="w-10 h-10 rounded-full shrink-0" />
            ) : (
              <DefaultImage iconSize="size-4" width="w-10" height="h-10" rounded="rounded-full shrink-0" />
            )}
          </div>

          <div>
            <p className="font-bold">{username}</p>
            <p>{comment.content}</p>
            <p className="text-sm text-gray-500 mt-4">{formatCommentDate(comment.created_at)}</p>
          </div>
        </div>
        {isLastInThread && (
          <div className="mt-2">
            {serverValidationError.error && (
              <div><p className="error text-red-500 text-sm mt-2">{serverValidationError.error}</p></div>
            )}

            <textarea
              className="textarea textarea-bordered w-full"
              placeholder={t("write-comment")}
              value={replyContents[comment.id] || ''}
              onChange={(e) => handleReplyChange(comment.id, e.target.value)}
            ></textarea>
            <button
              className="mt-2 btn btn-primary"
              onClick={() => submitReply(comment.id)}
            >
              {t("submit-reply")}
            </button>
          </div>
        )}
        <div className="mt-2">
          {subComments.map(subComment =>
            renderComment(subComment, depth + 1)
          )}
        </div>
      </div>
    )
  }

  const visibleTopLevelComments = comments.filter(comment =>
    comment.parent_comment_id === null && canViewComment(comment)
  );

  return (
    <div>
      <h3 className="text-xl mb-5">{t("Messages")} ({comments.length})</h3>
      {!userHasExistingThread() && <CommentForm adId={adId} onCommentAdded={addNewComment} />}

      {visibleTopLevelComments.map(comment => (
        <div key={comment.id}>
          <h4 className="text-xl mb-2">
            {t("From")} <span className="text-accent dark:text-secondary font-medium">{comment?.profiles?.username}</span>
          </h4>
          {renderComment(comment, 0)}
        </div>
      ))}
    </div>
  )
}