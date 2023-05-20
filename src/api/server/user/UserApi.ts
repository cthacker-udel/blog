/* eslint-disable @typescript-eslint/indent -- disabled */
import type { NextApiRequest, NextApiResponse } from "next";

import type { ApiResponse, User } from "@/@types";
import { EncryptionService } from "@/api/service/encryption";
import { convertErrorToApiResponse, generateEntityDateTimes } from "@/common";
import { Collections } from "@/constants";

import { DatabaseApi } from "../database";
import type { IUserApi } from "./IUserApi";

/**
 * Server-side user api implementation
 */
export class UserApi extends DatabaseApi implements IUserApi {
    /**
     * Used during signup and login
     */
    public static encryptionService: EncryptionService;

    /**
     * No-arg constructor
     * Instantiates the mongo api of this class, which will be carried across instances
     */
    public constructor() {
        super();
        UserApi.encryptionService = new EncryptionService();
    }

    /** @inheritdoc */
    public doesUsernameAlreadyExist = async (
        username: string,
    ): Promise<boolean> => {
        try {
            const userRepo = this.getMongoRepo<User>(Collections.USERS);
            const doesUserExist = await userRepo.findOne({ username });
            return doesUserExist !== null;
        } catch (error: unknown) {
            await this.logMongoError(error);
            return true;
        }
    };

    /** @inheritdoc */
    public signUp = async (
        request: NextApiRequest,
        response: NextApiResponse,
    ): Promise<void> => {
        try {
            await this.startMongoTransaction();
            const { password, username } = request.body as Pick<
                User,
                "password" | "username"
            >;

            if (username === undefined || password === undefined) {
                throw new Error("Invalid credentials supplied");
            }

            const doesUsernameAlreadyExist =
                await this.doesUsernameAlreadyExist(username);

            if (doesUsernameAlreadyExist) {
                throw new Error("Username already exists");
            }

            const hashResult = UserApi.encryptionService.hashPassword(password);

            const userRepo = this.getMongoRepo<User>(Collections.USERS);

            const insertionResult = userRepo.insertOne({
                password: hashResult.hash,
                passwordSalt: hashResult.salt,
                username,
                ...generateEntityDateTimes(),
            });

            response.status(insertionResult === null ? 400 : 200);
            response.send({
                data: insertionResult !== null,
            } as ApiResponse<boolean>);
        } catch (error: unknown) {
            await this.logMongoError(error);
            response.status(500);
            response.send(convertErrorToApiResponse(error, false));
        } finally {
            await this.closeMongoTransaction();
        }
    };

    /** @inheritdoc */
    public login = async (
        request: NextApiRequest,
        response: NextApiResponse,
    ): Promise<void> => {
        try {
            await this.startMongoTransaction();
            const { password, username } = request.body as Pick<
                User,
                "password" | "username"
            >;

            if (password === undefined || username === undefined) {
                throw new Error(
                    "Must send username and password when making request",
                );
            }

            const userRepo = this.getMongoRepo<User>(Collections.USERS);

            const foundUser = await userRepo.findOne({ username });

            if (foundUser === null) {
                throw new Error("User does not exist");
            }

            const fixedHash = UserApi.encryptionService.fixedHash(
                password,
                foundUser.passwordSalt,
            );

            const isSuccessful = fixedHash === foundUser.password;

            response.status(isSuccessful ? 200 : 400);
            response.send({ data: isSuccessful } as ApiResponse<boolean>);
        } catch (error: unknown) {
            console.log("catching", error);
            await this.logMongoError(error);
            response.status(500);
            response.send(convertErrorToApiResponse(error, false));
        } finally {
            await this.closeMongoTransaction();
        }
    };
}
