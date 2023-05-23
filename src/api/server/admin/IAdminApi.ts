import type {
    NextApiRequest as ClientRequest,
    NextApiResponse as ServerResponse,
} from "next";

/**
 * Shorten typing, just an abbreviation of Promise<void>
 */
type PV = Promise<void>;

export interface IAdminApi {
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
