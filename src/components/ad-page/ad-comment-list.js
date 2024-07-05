'use client'

import { useState, useEffect } from 'react'
import { fetchComments, addComment } from '@/lib/comments';
import { formatCommentDate } from '@/utils/formatter/format-comment-date';
import CommentForm from './ad-comment-form';
import { useTranslations } from 'next-intl';

export default function CommentList({ initialComments, ad, adId, user }) {
  const t = useTranslations("comments");

  if (!user) {
    return <p>{t("not-logged-in")}</p>;
  }
  const { id: currentUserId } = user;
  const [comments, setComments] = useState(initialComments)
  const [replyContents, setReplyContents] = useState({})
  const [serverValidationError, setServerValidationError] = useState({ error: null });


  const isAdmin = user?.is_admin
  const isAdOwner = ad.user_id === currentUserId;

  useEffect(() => {
    const intervalId = setInterval(async () => {
      const { data: updatedComments } = await fetchComments(adId)
      setComments(updatedComments);
    }, 100000) // Refresh comments every 100 seconds

    return () => clearInterval(intervalId)
  }, [adId])

  const handleReplyChange = (commentId, content) => {
    setReplyContents(prev => ({ ...prev, [commentId]: content }))
  }

  const submitReply = async (parentCommentId) => {
    try {
      const replyContent = replyContents[parentCommentId] || ''
      const newComment = await addComment(adId, replyContent, parentCommentId)
      setComments(prevComments => [...prevComments, newComment])
      setReplyContents(prev => ({ ...prev, [parentCommentId]: '' }))
      setServerValidationError({ error: null })

    } catch (error) {
      // console.error('Error submitting reply:', error)
      setServerValidationError({ error: error.message })
    }
  }

  const addNewComment = (newComment) => {
    setComments(prevComments => [...prevComments, newComment])
  }

  const canViewComment = (comment) => {
    if (isAdmin || isAdOwner || comment.user_id === currentUserId) {
      return true;
    }

    // Check if this comment is part of a thread the user is involved in
    const isPartOfUserThread = (commentId) => {
      const parentComment = comments.find(c => c.id === commentId);
      if (!parentComment) return false;
      if (parentComment.user_id === currentUserId) return true;
      return parentComment.parent_comment_id ? isPartOfUserThread(parentComment.parent_comment_id) : false;
    };

    return isPartOfUserThread(comment.parent_comment_id);
  };

  const renderComment = (comment, depth = 0) => {
    if (!canViewComment(comment)) return null;

    const { avatar_url, username } = comment.profiles;
    const subComments = comments.filter(c => c.parent_comment_id === comment.id);
    const isLastInThread = subComments.length === 0;

    return (
      <div key={comment.id} className={comment.parent_comment_id === null ? "bg-base-200 p-5 rounded-box shadow-sm mb-5" : ''}>
        <div className="flex items-center space-x-3 mb-5">
          <img src={avatar_url} alt={username} className="w-10 h-10 rounded-full" />
          <div>
            <p className="font-bold">{username}</p>
            <p>{comment.content}</p>
            <p className="text-sm text-gray-500 mt-4">{formatCommentDate(comment.created_at)}</p>
          </div>
        </div>
        {isLastInThread && (
          <div className="mt-2">
            {serverValidationError.error && <div><p className="error text-red-500 text-sm mt-2">{serverValidationError.error}</p></div>}

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
          {subComments.map((subComment, index) =>
            renderComment(subComment, depth + 1, index === subComments.length - 1)
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
      <CommentForm adId={adId} onCommentAdded={addNewComment} />

      {visibleTopLevelComments.map((comment, index) => (
        <div key={comment.id}>
          <h4 className="text-xl mb-2">
            {t("From")} {comment?.profiles?.username}
          </h4>
          {renderComment(comment, 0)}
        </div>
      ))}
    </div>
  )
}