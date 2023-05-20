/* eslint-disable @typescript-eslint/indent -- disabled */

import type { ApiResponse, User } from "@/@types";
import { Endpoints } from "@/constants";

import { ServiceBaseController } from "../base/ServiceBaseController";
import type { IUserService } from "./IUserService";

/**
 *  Client-side implementation of methods invoking the user api
 */
export class UserService extends ServiceBaseController implements IUserService {
    /** @inheritdoc */
    public signUp = async (
        username: string,
        password: string,
    ): Promise<ApiResponse<boolean>> => {
        const response = await this.post<
            boolean,
            Pick<User, "password" | "username">
        >(`${Endpoints.USER.BASE}${Endpoints.USER.SIGNUP}`, {
            password,
            username,
        });
        return response;
    };

    /** @inheritdoc */
    public login = async (
        username: string,
        password: string,
    ): Promise<ApiResponse<boolean>> => {
        const response = await this.post<
            boolean,
            Pick<User, "password" | "username">
        >(`${Endpoints.USER.BASE}${Endpoints.USER.LOGIN}`, {
            password,
            username,
        });

        return response;
    };
}
