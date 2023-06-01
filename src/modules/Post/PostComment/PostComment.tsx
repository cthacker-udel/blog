import React from "react";

import type { CommentWithUsername } from "@/@types";

import styles from "./PostComment.module.css";
import { PostService } from "@/api/service/post";
import { toast } from "react-toastify";

type PostCommentProperties = CommentWithUsername;

/**
 *
 * @param param0
 * @returns
 */
export const PostComment = ({
    _id,
    author: _author,
    comment,
    createdAt,
    dislikes,
    likes,
    modifiedAt,
    username,
}: PostCommentProperties): JSX.Element => {
    const likePost = React.useCallback(async () => {
        const likingToast = toast.loading("Liking comment...");
        const { data: likeCommentResponse } =
            await new PostService().likeComment(_id);

        if (likeCommentResponse) {
            toast.update(likingToast, {
                autoClose: 1500,
                isLoading: false,
                render: "Successfully liked comment!",
                type: "success",
            });
        } else {
            toast.update(likingToast, {
                autoClose: 1500,
                isLoading: false,
                render: "Failed to like comment",
                type: "error",
            });
        }
    }, [_id]);

    return (
        <div className={`${styles.post_content} shadow-lg`}>
            <div className={styles.post_info}>
                <span className={styles.post_author}>{username}</span>
                <div className={styles.post_date}>
                    <i className="fa-solid fa-plus fa-xs" />
                    <span className={styles.post_created_at}>
                        {new Date(createdAt).toDateString()}
                    </span>
                </div>
                <div className={styles.post_date}>
                    <i className="fa-solid fa-pencil fa-xs" />
                    <span className={styles.post_modified_at}>
                        {new Date(modifiedAt).toDateString()}
                    </span>
                </div>
            </div>
            <div className={styles.post_comment}>{comment}</div>
            <div className={styles.post_metrics}>
                <div className={styles.post_metric}>
                    <i className="fa-solid fa-thumbs-up" />
                    <span>{likes}</span>
                </div>
                <div className={styles.post_metric}>
                    <i className="fa-solid fa-thumbs-down" />
                    <span>{dislikes}</span>
                </div>
            </div>
        </div>
    );
};
