import type { ObjectId } from "mongodb";
import type { NextApiRequest, NextApiResponse } from "next";

export interface IPostApi {
    /**
     * Adds a post to the database, and returns the id of the post that was created, for immediate redirection
     *
     * @param _request - The client request
     * @param _response - The client response
     * @returns - The id of the post that was created, null if unsuccessful
     */
    addPost: (
        _request: NextApiRequest,
        _response: NextApiResponse,
    ) => Promise<void>;

    /**
     * Checks whether the user is the author of the post specified in the url
     *
     * @param _userId - The id of the user we are checking is the owner of the post specified
     * @param _postId - The id of the post being navigated to
     * @returns Whether the user is the owner of the post being navigated to
     */
    isAuthorOfPost: (_userId: ObjectId, _postId: ObjectId) => Promise<boolean>;
}
