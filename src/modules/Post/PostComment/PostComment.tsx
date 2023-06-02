import React from "react";
import { Button } from "react-bootstrap";
import { toast } from "react-toastify";

import type { CommentWithUsername } from "@/@types";
import { PostService } from "@/api/service/post";
import { ReactionType } from "@/common";

import styles from "./PostComment.module.css";

type PostCommentProperties = CommentWithUsername & {
    doesDislike: boolean;
    doesLike: boolean;
    index: number;
    isLast: boolean;
    mutateComment: (
        _index: number,
        _reactionType: ReactionType,
        _commentId: string,
        _doesDislike: boolean,
        _doesLike: boolean,
    ) => Promise<void>;
};

/**
 * Represents a comment made to a post
 *
 * @param props - Properties of the post comment component
 * @param props._id - The ObjectID of the comment
 * @param props.author - The author of the comment
 * @param props.comment - The content of the comment
 * @param props.dislikes - The # of dislikes the comment has
 * @param props.index - The index of the comment (in relation to the array of all comments)
 * @param props.isLast - Whether the comment is the last in the array (auto-scrolls to bottom)
 * @param props.likes - The # of likes the comment has
 * @param props.modifiedAt - The last moment the comment was modified
 * @param props.mutateComment - Mutation function that modifies the internal cache storing the comment
 * @param props.username - The author's username
 *
 * @returns The post with multiple interaction components within it
 */
export const PostComment = ({
    _id,
    author: _author,
    comment,
    createdAt,
    dislikes,
    doesDislike,
    doesLike,
    index,
    isLast,
    likes,
    modifiedAt,
    mutateComment,
    username,
}: PostCommentProperties): JSX.Element => {
    const reactToComment = React.useCallback(
        async (reactType: ReactionType): Promise<void> => {
            if (_id !== undefined) {
                const reactingToast = toast.loading(
                    `${
                        reactType === ReactionType.LIKE ? "Liking" : "Disliking"
                    } comment...`,
                );
                const { data: reactionProcessed } =
                    await new PostService().reactComment(_id, reactType);
                if (reactionProcessed) {
                    toast.update(reactingToast, {
                        autoClose: 1500,
                        isLoading: false,
                        render: `${
                            reactType === ReactionType.LIKE
                                ? "Liked"
                                : "Disliked"
                        } comment!`,
                        type: "success",
                    });
                    await mutateComment(
                        index,
                        reactType,
                        _id.toString().toLowerCase(),
                        doesLike,
                        doesDislike,
                    );
                } else {
                    toast.update(reactingToast, {
                        autoClose: 1500,
                        isLoading: false,
                        render: `Failed to ${
                            reactType === ReactionType.LIKE ? "like" : "dislike"
                        } comment`,
                        type: "error",
                    });
                }
            }
        },
        [_id, doesDislike, doesLike, index, mutateComment],
    );

    React.useEffect(() => {
        if (isLast) {
            const postComments = document.querySelector("#post_comments");
            if (postComments !== null) {
                const convertedPostComments = postComments as HTMLDivElement;
                const lastElement =
                    convertedPostComments.children[
                        convertedPostComments.childElementCount - 1
                    ];
                if (lastElement !== null) {
                    lastElement.scrollIntoView({ behavior: "smooth" });
                }
            }
        }
    }, [isLast]);

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
                    <Button
                        onClick={async (): Promise<void> => {
                            await reactToComment(ReactionType.LIKE);
                        }}
                        variant={`${doesLike ? "success" : "outline-success"}`}
                    >
                        <i className="fa-solid fa-thumbs-up" />
                    </Button>
                    <span className={styles.post_metric_amount}>{likes}</span>
                </div>
                <div className={styles.post_metric}>
                    <Button
                        onClick={async (): Promise<void> => {
                            await reactToComment(ReactionType.DISLIKE);
                        }}
                        variant={`${doesDislike ? "danger" : "outline-danger"}`}
                    >
                        <i className="fa-solid fa-thumbs-down" />
                    </Button>
                    <span className={styles.post_metric_amount}>
                        {dislikes}
                    </span>
                </div>
            </div>
        </div>
    );
};
