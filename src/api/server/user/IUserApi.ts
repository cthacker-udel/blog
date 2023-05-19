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

    /**
     * Checks if the username already exists or not
     *
     * @param _username - The username to verify if it already exists
     * @returns Whether or not the username exists
     */
    doesUsernameAlreadyExist: (_username: string) => Promise<boolean>;
}
