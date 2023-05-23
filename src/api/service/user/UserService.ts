/* eslint-disable @typescript-eslint/indent -- disabled */

import type { ApiResponse, Post, User } from "@/@types";
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

    /** @inheritdoc */
    public logout = async (): Promise<ApiResponse<boolean>> => {
        const response = await this.get<boolean>(
            `${Endpoints.USER.BASE}${Endpoints.USER.LOGOUT}`,
        );

        return response;
    };

    /** @inheritdoc */
    public editUsername = async (
        username: string,
    ): Promise<ApiResponse<boolean>> => {
        const response = await this.post<boolean, Pick<User, "username">>(
            `${Endpoints.USER.BASE}${Endpoints.USER.EDIT_USERNAME}`,
            { username },
        );

        return response;
    };

    /** @inheritdoc */
    public doesUsernameExist = async (
        username: string,
    ): Promise<ApiResponse<boolean>> => {
        const response = await this.get<boolean>(
            `${Endpoints.USER.BASE}${Endpoints.USER.DOES_USERNAME_EXIST}?username=${username}`,
        );

        return response;
    };

    /** @inheritdoc */
    public addPost = async (title: string): Promise<ApiResponse<boolean>> => {
        const response = await this.post<boolean, Pick<Post, "title">>(
            `${Endpoints.POST.BASE}${Endpoints.POST.ADD}`,
            { title },
        );

        return response;
    };
}
