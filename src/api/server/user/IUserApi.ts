import type { ObjectId } from "mongodb";
import type {
    NextApiRequest as ClientRequest,
    NextApiResponse as ServerResponse,
} from "next";

import type { User } from "@/@types";

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
     * Edits the user's username with the one sent in the POST body
     *
     * @param _request - The client request
     * @param _response - The server response
     * @returns Whether the edit was successful
     */
    editUsername: (_request: ClientRequest, _response: ServerResponse) => PV;

    /**
     * Checks in the database whether the username exists
     *
     * @param _request - The client request
     * @param _response - The client response
     * @returns Whether the username exists
     */
    doesUsernameExist: (
        _request: ClientRequest,
        _response: ServerResponse,
    ) => PV;

    /**
     * [SERVER-SIDE ONLY (called from getServerSideProps)]
     * Fetches the user dashboard props, which include the username and the role
     *
     * @param _request - The client request
     * @returns The dashboard information pertaining to the user requesting
     */
    ssGetDashboardCredentials: (
        _request: ClientRequest,
    ) => Promise<Partial<Pick<User, "createdAt" | "role" | "username">>>;

    /**
     * [SERVER-SIDE ONLY] (called from getServerSideProps)
     * Fetches the user id from the database, takes in the username as a query string
     *
     * @param _username - The username of the user requesting their user id
     * @returns The id of the user with the username sent in the request
     */
    getUserIdFromUsername: (_username: string) => Promise<ObjectId>;

    /**
     * Fetches all requester's notifications (requester being the one who sent the request)
     *
     * @param _request - The client request
     * @param _response - The server response
     * @returns All notifications belonging to the requester
     */
    allUserNotifications: (
        _request: ClientRequest,
        _response: ServerResponse,
    ) => PV;

    /**
     * Removes the notification specified by the id provided in the payload
     *
     * @param _request - The client request
     * @param _response - The server response
     * @returns Whether the notification was removed
     */
    removeNotification: (
        _request: ClientRequest,
        _response: ServerResponse,
    ) => PV;

    /**
     *  Validates the user session, parsing the cookie sent, if one exists
     *
     * @param _request - The client request
     * @param _response - The server response
     * @returns Whether the session is valid
     */
    validateSession: (_request: ClientRequest, _response: ServerResponse) => PV;

    /**
     * [SERVER-SIDE ONLY]
     * Gets all the user's likes and dislikes, used for loading in post, detects if the user already liked/disliked the comment or not.
     * Used when mutating the cache as well in the event if a user either freshly likes the comment, switches to dislike, or re-likes to cancel it out.
     *
     * @param _username - The username of the current logged in user
     * @returns The likes and dislikes of the user currently
     */
    getLikesAndDislikes: (
        _username: string,
    ) => Promise<Pick<User, "dislikes" | "likes">>;
}
