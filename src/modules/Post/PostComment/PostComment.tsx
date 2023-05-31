import React from "react";

import type { CommentWithUsername } from "@/@types";

import styles from "./PostComment.module.css";

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
}: PostCommentProperties): JSX.Element => (
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
