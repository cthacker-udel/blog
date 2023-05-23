import { verify } from "jsonwebtoken";
import type { NextApiRequest } from "next";

import type { User } from "@/@types";

/**
 * Parses the username from the cookie supplied in the request, which is a result of the user logging in
 *
 * @param request - The request to parse
 * @returns The parsed cookie, with the username returned
 */
export const parseCookie = (
    request: NextApiRequest,
): Pick<User, "username"> => {
    const cookie =
        request.cookies[process.env.COOKIE_NAME as unknown as string];

    if (cookie === undefined) {
        throw new Error("Cookie does not exist in request");
    }

    const cookiePayload = verify(
        cookie,
        process.env.JWT_SIGN_HASH as unknown as string,
    ) as Pick<User, "username">;

    if (
        cookiePayload.username === undefined ||
        cookiePayload.username.length === 0
    ) {
        throw new Error(
            "Cookie is invalid, username does not exist or is empty string",
        );
    }

    return cookiePayload;
};
