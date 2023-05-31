import type { ApiResponse } from "@/@types";

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
     * @returns Whether the comment was added successfully
     */
    addComment: (
        _comment: string,
        _postId: string,
    ) => Promise<ApiResponse<boolean>>;
}
