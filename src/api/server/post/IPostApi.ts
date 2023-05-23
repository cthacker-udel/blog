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
}
