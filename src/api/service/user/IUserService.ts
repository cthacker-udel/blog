/* eslint-disable @typescript-eslint/no-extraneous-class -- disabled */

import type { ApiResponse } from "@/@types";

/**
 * Interface for all methods involving the user
 */
export interface IUserService {
    /**
     * Attempts to sign a user up in the database
     *
     * @param _username - The username that is being registered in the application
     * @param _encryptedInformation - The password that the user entered in
     * @returns Whether or not the user signed up
     */
    signUp: (
        _username: string,
        _password: string,
    ) => Promise<ApiResponse<boolean>>;

    /**
     * Attempts to log the user into the service
     *
     * @param _username - The username logging in
     * @param _password - The password logging in
     * @returns Whether the login was successful
     */
    login: (
        _username: string,
        _password: string,
    ) => Promise<ApiResponse<boolean>>;
}
