/* eslint-disable camelcase -- disabled */
/* eslint-disable import/no-nodejs-modules -- disabled */
/* eslint-disable @typescript-eslint/indent -- disabled */
import type { IncomingMessage, ServerResponse } from "node:http";

import { type MailDataRequired, MailService } from "@sendgrid/mail";
import { deleteCookie, setCookie } from "cookies-next";
import { sign } from "jsonwebtoken";
import type { NextApiRequest, NextApiResponse } from "next";

import type { ApiResponse, User } from "@/@types";
import type { AdminRequest } from "@/@types/api/AdminRequest";
import { EncryptionService } from "@/api/service/encryption";
import {
    convertErrorToApiResponse,
    generateEntityDateTimes,
    generateRequestAdminAccessConfirmationLink,
    parseCookie,
    UserRoles,
} from "@/common";
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
            const { password, username } = JSON.parse(request.body) as Pick<
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

            const insertionResult = await userRepo.insertOne({
                password: hashResult.hash,
                passwordSalt: hashResult.salt,
                username,
                ...generateEntityDateTimes(),
                role: UserRoles.USER,
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
    public createSessionToken = async (username: string): Promise<string> => {
        try {
            const token = sign(
                JSON.stringify({ username }),
                process.env.JWT_SIGN_HASH as unknown as string,
            );
            return token;
        } catch (error: unknown) {
            await this.logMongoError(error);
            throw error;
        }
    };

    /** @inheritdoc */
    public login = async (
        request: NextApiRequest,
        response: NextApiResponse,
    ): Promise<void> => {
        try {
            await this.startMongoTransaction();
            const { password, username } = JSON.parse(request.body) as Pick<
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

            if (isSuccessful) {
                const token = await this.createSessionToken(username);
                setCookie(process.env.COOKIE_NAME as unknown as string, token, {
                    maxAge: 1800,
                    req: request,
                    res: response,
                });
            }

            response.status(isSuccessful ? 200 : 400);
            response.send({ data: isSuccessful } as ApiResponse<boolean>);
        } catch (error: unknown) {
            await this.logMongoError(error);
            response.status(500);
            response.send(convertErrorToApiResponse(error, false));
        } finally {
            await this.closeMongoTransaction();
        }
    };

    /** @inheritdoc */
    public logout = async (
        request: IncomingMessage | NextApiRequest,
        response: NextApiResponse | ServerResponse,
    ): Promise<void> => {
        try {
            await this.startMongoTransaction();
            deleteCookie(process.env.COOKIE_NAME as unknown as string, {
                req: request,
                res: response,
            });
            if ((response as NextApiResponse) === undefined) {
                (response as ServerResponse).write(
                    JSON.stringify({ data: true }),
                );
            } else {
                (response as NextApiResponse).send({ data: true });
            }
        } catch (error: unknown) {
            await this.logMongoError(error);
            if ((response as NextApiResponse) === undefined) {
                (response as ServerResponse).statusCode = 500;
                (response as ServerResponse).write(
                    JSON.stringify(convertErrorToApiResponse(error, false)),
                );
            } else {
                (response as NextApiResponse).status(500);
                (response as NextApiResponse).send(
                    convertErrorToApiResponse(error, false),
                );
            }
        } finally {
            await this.closeMongoTransaction();
        }
    };

    /** @inheritdoc */
    public requestAdminAccess = async (
        request: NextApiRequest,
        response: NextApiResponse,
    ): Promise<void> => {
        try {
            await this.startMongoTransaction();
            const sendgridClient = new MailService();
            sendgridClient.setApiKey(
                process.env.SENDGRID_API_KEY as unknown as string,
            );
            const adminRequestRepo = this.getMongoRepo<AdminRequest>(
                Collections.ADMIN_REQUESTS,
            );
            const userRepo = this.getMongoRepo<User>(Collections.USERS);

            const { username } = parseCookie(request);

            const foundUser = await userRepo.findOne({ username });

            if (foundUser === null) {
                throw new Error(
                    "Could not find user requesting admin access in database",
                );
            }

            const foundRequest = await adminRequestRepo.findOne({
                user_id: foundUser._id,
            });

            if (foundRequest !== null) {
                throw new Error("Request for admin access already exists");
            }

            const makeRequest = await adminRequestRepo.insertOne({
                requestedAt: new Date(Date.now()),
                user_id: foundUser._id,
            });

            if (!makeRequest.acknowledged) {
                response.send({ data: false });
            }

            const link = generateRequestAdminAccessConfirmationLink(
                makeRequest.insertedId,
                username,
            );

            const [sendEmailResponse] = await sendgridClient.send({
                dynamicTemplateData: { link, username },
                templateId: process.env
                    .REQUEST_ADMIN_ACCESS_EMAIL_TEMPLATE_ID as unknown as string,
                to: {
                    email: process.env
                        .SENDGRID_ADMIN_TO_EMAIL as unknown as string,
                },
            } as unknown as MailDataRequired);

            response.send({ data: sendEmailResponse.statusCode === 202 });
        } catch (error: unknown) {
            await this.logMongoError(error);
            response.status(500);
            response.send(convertErrorToApiResponse(error, false));
        } finally {
            await this.closeMongoTransaction();
        }
    };
}
