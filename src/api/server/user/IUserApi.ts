import type { NextApiRequest, NextApiResponse } from "next";

export interface IUserApi {
    /**
     * Attempts to sign a user up in the database
     *
     * @param _request - The client request
     * @param _response - The client response
     * @returns Whether or not the user signed up
     */
    signUp: (
        _request: NextApiRequest,
        _response: NextApiResponse,
    ) => Promise<void>;
}
