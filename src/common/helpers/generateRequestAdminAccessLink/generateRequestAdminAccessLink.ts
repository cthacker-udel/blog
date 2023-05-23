import type { ObjectId } from "mongodb";

import { Endpoints } from "@/constants";

/**
 * Generates a link to add into the email, which will be clicked by the admin confirming/rejecting the request
 *
 * @param id - The object id of the created request
 * @param username - The username associated with the request
 * @param url - The base url to link to the button in the email
 * @param confirm - Whether the email is for confirmation or rejection
 */
export const generateRequestAdminAccessLink = (
    id: ObjectId,
    username: string,
    url: string,
    confirm = true,
): string =>
    `${url}/api/${Endpoints.ADMIN.BASE}${
        confirm ? Endpoints.ADMIN.CONFIRM_ACCESS : Endpoints.ADMIN.REJECT_ACCESS
    }?username=${username}&id=${id.toString()}`;
