import { CornerDownRight, Trash2 } from "lucide-react";
import { useState, type FormEvent } from "react";
import {
  feedbackContentMaxLength,
  feedbackNicknameMaxLength,
  type FeedbackComment,
  type FeedbackPost
} from "../feedback/feedbackBoardApi";
import { Button } from "./ui/Button";

/** Set on items shown before the server has confirmed them. */
export type FeedbackLocalState = {
  localStatus?: "sending" | "failed";
  localError?: string;
};

export type FeedbackDisplayComment = FeedbackComment & FeedbackLocalState;
export type FeedbackDisplayPost = Omit<FeedbackPost, "comments"> &
  FeedbackLocalState & { comments: FeedbackDisplayComment[] };

type FeedbackPostCardProps = {
  post: FeedbackDisplayPost;
  isAdmin: boolean;
  defaultNickname: string;
  busy: boolean;
  /** Returns false when the comment was not accepted (the form keeps its text). */
  onAddComment: (
    postId: string,
    input: { nickname: string; content: string; website: string }
  ) => boolean;
  onDeletePost: (postId: string, password?: string) => Promise<boolean>;
  onDeleteComment: (commentId: string) => Promise<boolean>;
  onRetryPost: (postId: string) => void;
  onDiscardPost: (postId: string) => void;
  onRetryComment: (commentId: string) => void;
  onDiscardComment: (commentId: string) => void;
};

export function formatFeedbackDate(iso: string): string {
  const date = new Date(iso);

  if (Number.isNaN(date.getTime())) {
    return iso;
  }

  return date.toLocaleString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false
  });
}

function LocalStatus({
  state,
  onRetry,
  onDiscard
}: {
  state: FeedbackLocalState;
  onRetry: () => void;
  onDiscard: () => void;
}) {
  if (state.localStatus === "sending") {
    return (
      <span className="feedback-local-status" role="status">
        등록 중…
      </span>
    );
  }

  if (state.localStatus === "failed") {
    return (
      <span className="feedback-local-status feedback-local-status--failed" role="alert">
        <span>등록하지 못했습니다. {state.localError}</span>
        <button className="feedback-text-button" onClick={onRetry} type="button">
          다시 시도
        </button>
        <button
          className="feedback-text-button feedback-text-button--danger"
          onClick={onDiscard}
          type="button"
        >
          지우기
        </button>
      </span>
    );
  }

  return null;
}

export function FeedbackPostCard({
  post,
  isAdmin,
  defaultNickname,
  busy,
  onAddComment,
  onDeletePost,
  onDeleteComment,
  onRetryPost,
  onDiscardPost,
  onRetryComment,
  onDiscardComment
}: FeedbackPostCardProps) {
  const [showCommentForm, setShowCommentForm] = useState(false);
  const [commentNickname, setCommentNickname] = useState(defaultNickname);
  const [commentContent, setCommentContent] = useState("");
  const [commentWebsite, setCommentWebsite] = useState("");
  const [showDeleteRow, setShowDeleteRow] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");
  const isConfirmed = post.localStatus === undefined;

  function submitComment(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const accepted = onAddComment(post.id, {
      nickname: isAdmin ? "운영자" : commentNickname,
      content: commentContent,
      website: commentWebsite
    });

    if (accepted) {
      setCommentContent("");
      setShowCommentForm(false);
    }
  }

  async function confirmDelete(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const ok = await onDeletePost(post.id, isAdmin ? undefined : deletePassword);

    if (ok) {
      setShowDeleteRow(false);
      setDeletePassword("");
    }
  }

  return (
    <article
      className={isConfirmed ? "feedback-post" : "feedback-post feedback-post--local"}
      aria-label={`${post.nickname}의 글`}
    >
      <header className="feedback-post__header">
        <strong>{post.nickname}</strong>
        <span className="feedback-post__meta">
          <time dateTime={post.createdAt}>{formatFeedbackDate(post.createdAt)}</time>
          {post.appVersion ? <span>ver {post.appVersion}</span> : null}
        </span>
      </header>
      <p className="feedback-post__content">{post.content}</p>
      <LocalStatus
        onDiscard={() => onDiscardPost(post.id)}
        onRetry={() => onRetryPost(post.id)}
        state={post}
      />

      {post.comments.length > 0 ? (
        <ul className="feedback-comment-list" aria-label="댓글">
          {post.comments.map((comment) => (
            <li
              key={comment.id}
              className={
                comment.isAdmin
                  ? "feedback-comment feedback-comment--admin"
                  : "feedback-comment"
              }
            >
              <CornerDownRight size={14} aria-hidden="true" />
              <div className="feedback-comment__body">
                <div className="feedback-comment__header">
                  <strong>{comment.nickname}</strong>
                  {comment.isAdmin ? (
                    <span className="feedback-admin-badge">운영자</span>
                  ) : null}
                  <time dateTime={comment.createdAt}>
                    {formatFeedbackDate(comment.createdAt)}
                  </time>
                  {isAdmin && comment.localStatus === undefined ? (
                    <button
                      className="feedback-text-button"
                      disabled={busy}
                      onClick={() => void onDeleteComment(comment.id)}
                      type="button"
                    >
                      댓글 삭제
                    </button>
                  ) : null}
                </div>
                <p>{comment.content}</p>
                <LocalStatus
                  onDiscard={() => onDiscardComment(comment.id)}
                  onRetry={() => onRetryComment(comment.id)}
                  state={comment}
                />
              </div>
            </li>
          ))}
        </ul>
      ) : null}

      {isConfirmed ? (
        <div className="feedback-post__actions">
          <button
            className="feedback-text-button"
            onClick={() => setShowCommentForm((value) => !value)}
            type="button"
          >
            {showCommentForm ? "댓글 취소" : "댓글 달기"}
          </button>
          <button
            className="feedback-text-button feedback-text-button--danger"
            disabled={busy}
            onClick={() => setShowDeleteRow((value) => !value)}
            type="button"
          >
            {showDeleteRow ? "삭제 취소" : "글 삭제"}
          </button>
        </div>
      ) : null}

      {isConfirmed && showCommentForm ? (
        <form className="feedback-comment-form" onSubmit={submitComment}>
          {isAdmin ? (
            <p className="feedback-comment-form__admin-note">
              운영자 이름으로 답글이 등록됩니다.
            </p>
          ) : (
            <label>
              닉네임
              <input
                maxLength={feedbackNicknameMaxLength}
                onChange={(event) => setCommentNickname(event.target.value)}
                required
                value={commentNickname}
              />
            </label>
          )}
          <label className="feedback-comment-form__content">
            댓글 내용
            <textarea
              maxLength={feedbackContentMaxLength}
              onChange={(event) => setCommentContent(event.target.value)}
              required
              rows={3}
              value={commentContent}
            />
          </label>
          <input
            aria-hidden="true"
            autoComplete="off"
            className="visually-hidden"
            name="website"
            onChange={(event) => setCommentWebsite(event.target.value)}
            tabIndex={-1}
            value={commentWebsite}
          />
          <div className="feedback-comment-form__actions">
            <Button type="submit">댓글 등록</Button>
          </div>
        </form>
      ) : null}

      {isConfirmed && showDeleteRow ? (
        <form className="feedback-delete-row" onSubmit={confirmDelete}>
          {isAdmin ? (
            <span>운영자 권한으로 이 글을 삭제합니다.</span>
          ) : (
            <label>
              삭제용 비밀번호
              <input
                autoComplete="off"
                onChange={(event) => setDeletePassword(event.target.value)}
                required
                type="password"
                value={deletePassword}
              />
            </label>
          )}
          <Button
            disabled={busy}
            icon={<Trash2 size={15} aria-hidden="true" />}
            type="submit"
            variant="secondary"
          >
            삭제 확인
          </Button>
        </form>
      ) : null}
    </article>
  );
}
