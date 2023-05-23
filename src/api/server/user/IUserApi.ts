import type {
    NextApiRequest as ClientRequest,
    NextApiResponse as ServerResponse,
} from "next";

/**
 * Shorten typing, just an abbreviation of Promise<void>
 */
type PV = Promise<void>;

/**
 *
 */
export interface IUserApi {
    /**
     * Attempts to sign a user up in the database
     *
     * @param _request - The client request
     * @param _response - The server response
     * @returns Whether or not the user signed up
     */
    signUp: (_request: ClientRequest, _response: ServerResponse) => PV;

    /**
     * Checks if the username already exists or not
     *
     * @param _username - The username to verify if it already exists
     * @returns Whether or not the username exists
     */
    doesUsernameAlreadyExist: (_username: string) => Promise<boolean>;

    /**
     * Attempts to log the user into the database
     *
     * @param _request - The client request
     * @param _response - The server response
     * @returns Whether the login was successful or not
     */
    login: (_request: ClientRequest, _response: ServerResponse) => PV;

    /**
     * Creates a session token for the user
     *
     * @param _username - The username of the user we are creating a session token for
     * @returns The created token, empty string if failed
     */
    createSessionToken: (_username: string) => Promise<string>;

    /**
     * Attempts to log the user out of the website, essentially erasing their session, which automatically kicks them out
     *
     * @param _request - The client request
     * @param _response - The client response
     * @returns Whether the logout was successful
     */
    logout: (_request: ClientRequest, _response: ServerResponse) => PV;

    /**
     * Attempts to send a request for admin access to the admin email
     *
     * @param _request - The client request
     * @param _response - The client response
     * @returns Whether the request was sent
     */
    requestAdminAccess: (
        _request: ClientRequest,
        _response: ServerResponse,
    ) => PV;

    /**
     * Rejects a request from a user for admin access to the blog website
     *
     * @param _request - The client request
     * @param _response - The server response
     * @returns Whether the rejection was successful
     */
    rejectAdminAccess: (
        _request: ClientRequest,
        _response: ServerResponse,
    ) => PV;

    /**
     * Confirms a request from a user for admin access to the blog website
     *
     * @param _request - The client request
     * @param _response - The server response
     * @returns Whether the confirmation was successful
     */
    confirmAdminAccess: (
        _request: ClientRequest,
        _response: ServerResponse,
    ) => PV;
}
