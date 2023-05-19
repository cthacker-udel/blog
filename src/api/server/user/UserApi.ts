/* eslint-disable class-methods-use-this -- disabled */
/* eslint-disable @typescript-eslint/indent -- disabled */
import type { NextApiRequest, NextApiResponse } from "next";

import type { User } from "@/@types";
import { EncryptionService } from "@/api/service/encryption";

import { MongoApi } from "../mongo/MongoApi";
import type { IUserApi } from "./IUserApi";

/**
 *
 */
export class UserApi implements IUserApi {
    public static mongoApi: MongoApi;

    public static encryptionService: EncryptionService;

    /**
     * No-arg constructor
     * Instantiates the mongo api of this class, which will be carried across instances
     */
    public constructor() {
        UserApi.mongoApi = new MongoApi(
            process.env.MONGO_USER_COLLECTION as unknown as string,
        );
        UserApi.encryptionService = new EncryptionService();
    }

    /** @inheritdoc */
    public doesUsernameAlreadyExist = async (
        username: string,
    ): Promise<boolean> => {
        try {
            const request = UserApi.mongoApi.getRepo()?.findOne({ username });
            return request !== null;
        } catch (error: unknown) {
            await UserApi.mongoApi.logError(error);
            return true;
        }
    };

    /** @inheritdoc */
    public signUp = async (
        request: NextApiRequest,
        response: NextApiResponse,
    ): Promise<void> => {
        try {
            const requestBody = request.body as Pick<
                User,
                "password" | "username"
            >;

            if (
                requestBody.username === undefined ||
                requestBody.password === undefined
            ) {
                throw new Error("Invalid credentials supplied");
            }

            const { username, password } = requestBody;

            const doesUsernameAlreadyExist =
                await this.doesUsernameAlreadyExist(username);

            if (doesUsernameAlreadyExist) {
                throw new Error("Username already exists");
            }

            const hashResult = UserApi.encryptionService.hashPassword(password);

            const insertionResult =
                await UserApi.mongoApi.collection?.insertOne({
                    password: hashResult.hash,
                    passwordSalt: hashResult.salt,
                    username,
                } as Partial<User>);

            response.status(insertionResult === null ? 400 : 200);
            response.send({});
        } catch (error: unknown) {
            await UserApi.mongoApi.logError(error, response);
        }
    };
}
