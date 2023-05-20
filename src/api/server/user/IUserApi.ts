/* eslint-disable @typescript-eslint/no-extraneous-class -- disabled */
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
export abstract class IUserApi {
    /**
     * Attempts to sign a user up in the database
     *
     * @param _request - The client request
     * @param _response - The server response
     * @returns Whether or not the user signed up
     */
    public static signUp: (
        _request: ClientRequest,
        _response: ServerResponse,
    ) => PV;

    /**
     * Checks if the username already exists or not
     *
     * @param _username - The username to verify if it already exists
     * @returns Whether or not the username exists
     */
    public static doesUsernameAlreadyExist: (
        _username: string,
    ) => Promise<boolean>;

    /**
     * Attempts to log the user into the database
     *
     * @param _request - The client request
     * @param _response - The server response
     * @returns Whether the login was successful or not
     */
    public static login: (
        _request: ClientRequest,
        _response: ServerResponse,
    ) => PV;
}
