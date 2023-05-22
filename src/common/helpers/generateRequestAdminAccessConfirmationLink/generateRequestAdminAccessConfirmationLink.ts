import type { ObjectId } from "mongodb";

/**
 * Generates a link to add into the email, which will be clicked by the user confirming the request
 *
 * @param id - The object id of the created request
 * @param username - The username associated with the request
 */
export const generateRequestAdminAccessConfirmationLink = (
    id: ObjectId,
    username: string,
): string =>
    `${window.location.protocol}//${window.location.hostname}:${
        window.location.port
    }/api/confirmAdminAccessRequest?username=${username}&id=${id.toString()}`;
