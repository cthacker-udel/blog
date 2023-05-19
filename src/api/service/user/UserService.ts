import type { User } from "@/@types";

import { IUserService } from "./IUserService";

/**
 *  Client-side implementation of methods invoking the user api
 */
export class UserService extends IUserService {
    /** @inheritdoc */
    public static signUp = async (
        username: string,
        password: string,
    ): Promise<boolean> => {
        const response = await fetch(`${process.env.BASE_URL}user/signup`, {
            body: JSON.stringify({
                password,
                username,
            } as Pick<User, "password" | "username">),
            method: "POST",
        });

        return response.json() as Promise<boolean>;
    };
}
