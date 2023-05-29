import type { ApiResponse } from "@/@types";

export interface IPostService {
    /**
     * Updates the post specified by `_postId` with the content specified in `content`
     *
     * @param _content - The content to update the post with
     * @param _title - The updated title of the post
     * @param _postId - The id of the post we are updating
     * @returns Whether the update was successful
     */
    updatePost: (
        _content: string,
        _title: string,
        _postId: string,
    ) => Promise<ApiResponse<boolean>>;
}
