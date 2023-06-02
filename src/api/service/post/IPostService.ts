import type { ObjectId } from "mongodb";

import type { ApiResponse } from "@/@types";
import type { ReactionType } from "@/common";

export interface IPostService {
    /**
     * Updates the post specified by `_postId` with the content specified in `content`
     *
     * @param _htmlContent - The html content to update the post's content field with
     * @param _textContent - The raw text content of the post to update the post's text content field with
     * @param _title - The updated title of the post
     * @param _postId - The id of the post we are updating
     * @returns Whether the update was successful
     */
    updatePost: (
        _htmlContent: string,
        _textContent: string,
        _title: string,
        _postId: string,
    ) => Promise<ApiResponse<boolean>>;

    /**
     * Adds a comment to the post
     *
     * @param _comment - The comment to add
     * @param _postId - The id of the post we are adding the comment to
     * @returns Array consisting of [Post added successfully, the id of the created post]
     */
    addComment: (
        _comment: string,
        _postId: string,
    ) => Promise<ApiResponse<[boolean, ObjectId | undefined]>>;

    /**
     * Likes a comment made on a post
     *
     * @param _commentId - The comment to like
     * @param _reactionType - The type of reaction
     * @returns Whether the comment was liked or not
     */
    reactComment: (
        _commentId: ObjectId,
        _reactionType: ReactionType,
    ) => Promise<ApiResponse<boolean>>;
}
