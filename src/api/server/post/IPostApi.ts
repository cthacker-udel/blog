import type { ObjectId } from "mongodb";
import type { NextApiRequest, NextApiResponse } from "next";

import type { Post } from "@/@types";

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

    /**
     * Fetches all authored posts of the user requesting the endpoint
     *
     * @param _request - The client request
     * @param _response - The server response
     * @returns All authored posts of the user embedded within the request cookie
     */
    allAuthoredPosts: (
        _request: NextApiRequest,
        _response: NextApiResponse,
    ) => Promise<void>;

    /**
     * [SERVER-SIDE ONLY]
     * Fetches all the non-changing post details, such as the title, and the created date
     *
     * @param _postId - The id of the post to fetch
     * @returns All the immutable post details
     */
    ssGetPostDetails: (
        _postId: string,
    ) => Promise<Partial<Pick<Post, "createdAt" | "title">>>;

    /**
     * Fetches the content of the post from parsing the id of the post from the query string
     *
     * @param _request - The client request
     * @param _response - The client response
     * @returns The content of the post, the id of the post required in the query string
     */
    getPostContent: (
        _request: NextApiRequest,
        _response: NextApiResponse,
    ) => Promise<void>;

    /**
     * Updates the content of the post specified by the id passed in the request body
     *
     * @param _request - The client request
     * @param _response - The client response
     * @returns Whether the content was updated
     */
    updateContent: (
        _request: NextApiRequest,
        _response: NextApiResponse,
    ) => Promise<void>;

    /**
     * Gets the most recent posts from the database
     *
     * @param _request - The client request
     * @param _response - The client response
     * @returns All the most recent posts from the database
     */
    getMostRecentPosts: (
        _request: NextApiRequest,
        _response: NextApiResponse,
    ) => Promise<void>;

    /**
     * Adds a comment to the post
     *
     * @param _request - The client request
     * @param _response - The client response
     * @returns Adds a comment to a post specified in the request body
     */
    addComment: (
        _request: NextApiRequest,
        _response: NextApiResponse,
    ) => Promise<void>;

    /**
     * Gets all the comments of an associated post from the request body
     *
     * @param _request - The client request
     * @param _response - The client response=
     * @returns All the comments associated with the post
     */
    getComments: (
        _request: NextApiRequest,
        _response: NextApiResponse,
    ) => Promise<void>;
}
