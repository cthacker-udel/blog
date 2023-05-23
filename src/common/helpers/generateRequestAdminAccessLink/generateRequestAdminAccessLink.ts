import type { ObjectId } from "mongodb";

/**
 * Generates a link to add into the email, which will be clicked by the admin confirming/rejecting the request
 *
 * @param id - The object id of the created request
 * @param username - The username associated with the request
 * @param confirm - Whether the email is for confirmation or rejection
 */
export const generateRequestAdminAccessLink = (
    id: ObjectId,
    username: string,
    confirm = true,
): string =>
    `${window.location.protocol}//${window.location.hostname}:${
        window.location.port
    }/api/${
        confirm ? "confirm" : "reject"
    }AdminAccessRequest?username=${username}&id=${id.toString()}`;
