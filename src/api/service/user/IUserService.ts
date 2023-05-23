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

    /**
     * Attempts to log the user out of the service
     *
     * @returns Whether the logout was successful or not
     */
    logout: () => Promise<ApiResponse<boolean>>;

    /**
     * Replaces the current user's username, with the one requested
     *
     * @param _username - The username submitted for replacement
     * @returns Whether the replacement was successful
     */
    editUsername: (_username: string) => Promise<ApiResponse<boolean>>;

    /**
     * Checks in the database if the username already exists
     *
     * @param _username - The username to check if it already exists
     * @returns Whether the username exists
     */
    doesUsernameExist: (_username: string) => Promise<ApiResponse<boolean>>;
}
