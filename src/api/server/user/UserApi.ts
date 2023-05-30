/* eslint-disable import/no-nodejs-modules -- disabled */
/* eslint-disable @typescript-eslint/indent -- disabled */
import type { IncomingMessage } from "node:http";

import { deleteCookie, setCookie } from "cookies-next";
import { sign } from "jsonwebtoken";
import { ObjectId } from "mongodb";
import type { NextApiRequest, NextApiResponse } from "next";

import type { ApiResponse, User } from "@/@types";
import { EncryptionService } from "@/api/service/encryption";
import type { Notification } from "@/classes";
import {
    convertErrorToApiResponse,
    generateEntityDateTimes,
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
        request: IncomingMessage,
        response: NextApiResponse,
    ): Promise<void> => {
        try {
            await this.startMongoTransaction();
            deleteCookie(process.env.COOKIE_NAME as unknown as string, {
                req: request,
                res: response,
            });

            response.setHeader("Cache-Control", "no-cache");
            response.status(200);
            response.send({ data: true });
        } catch (error: unknown) {
            await this.logMongoError(error);
        } finally {
            await this.closeMongoTransaction();
        }
    };

    /** @inheritdoc */
    public editUsername = async (
        request: NextApiRequest,
        response: NextApiResponse,
    ): Promise<void> => {
        try {
            await this.startMongoTransaction();

            const userRepo = this.getMongoRepo<User>(Collections.USERS);

            const { username: replacementUsername } = request.body as Pick<
                User,
                "username"
            >;
            const username = parseCookie(request);

            if (replacementUsername === undefined) {
                throw new Error("Must supply username in request body");
            }

            const updateResult = await userRepo.updateOne(
                { username },
                { username: replacementUsername },
            );

            response.status(updateResult.acknowledged ? 200 : 400);
            response.send({ date: updateResult.acknowledged ? 200 : 400 });
        } catch (error: unknown) {
            await this.logMongoError(error);
        } finally {
            await this.closeMongoTransaction();
        }
    };

    /** @inheritdoc */
    public doesUsernameExist = async (
        request: NextApiRequest,
        response: NextApiResponse,
    ): Promise<void> => {
        try {
            await this.startMongoTransaction();

            const userRepo = this.getMongoRepo<User>(Collections.USERS);

            const username = request.query.username;

            if (username === undefined) {
                throw new Error(
                    "Username must be supplied in checking if one exists",
                );
            }

            const foundUsername = await userRepo.countDocuments({ username });

            response.status(foundUsername > 0 ? 200 : 400);
            response.send({ data: foundUsername > 0 });
        } catch (error: unknown) {
            await this.logMongoError(error);
        } finally {
            await this.closeMongoTransaction();
        }
    };

    /** @inheritdoc */
    public ssGetDashboardCredentials = async (
        request: NextApiRequest,
    ): Promise<Partial<Pick<User, "createdAt" | "role" | "username">>> => {
        await this.startMongoTransaction();
        const { username } = parseCookie(request);

        if (username === undefined) {
            return {};
        }

        const userRepo = this.getMongoRepo<User>(Collections.USERS);

        const foundUser = await userRepo.findOne(
            { username },
            {
                projection: { createdAt: 1, role: 1, username: 1 },
            },
        );

        if (foundUser === null) {
            throw new Error("Could not find user");
        }

        await this.closeMongoTransaction();
        return foundUser as Pick<User, "createdAt" | "role" | "username">;
    };

    /** @inheritdoc */
    public getUserIdFromUsername = async (
        username: string,
    ): Promise<ObjectId> => {
        try {
            await this.startMongoTransaction();

            const userRepo = this.getMongoRepo<User>(Collections.USERS);

            if (username === undefined) {
                throw new Error("Must supply cookie to get user id");
            }

            const foundUser = await userRepo.findOne({ username });

            if (foundUser === null) {
                throw new Error("Failed to find user");
            }

            return foundUser._id;
        } catch (error: unknown) {
            await this.logMongoError(error);
            throw error;
        } finally {
            await this.closeMongoTransaction();
        }
    };

    /** @inheritdoc */
    public allUserNotifications = async (
        request: NextApiRequest,
        response: NextApiResponse,
    ): Promise<void> => {
        try {
            await this.startMongoTransaction();

            const { username } = parseCookie(request);

            if (username === undefined) {
                throw new Error(
                    "Failed to get username from cookie, make sure you have a valid cookie, or try signing in again.",
                );
            }

            const userRepo = this.getMongoRepo<User>(Collections.USERS);
            const notificationRepo = this.getMongoRepo<Notification>(
                Collections.NOTIFICATIONS,
            );

            const foundUser = await userRepo.findOne({ username });

            if (foundUser === null) {
                throw new Error(
                    "The user whom the session cookie belongs to does not exist",
                );
            }

            const foundNotifications = await notificationRepo
                .find({
                    receiver: foundUser._id,
                })
                .toArray();

            response.status(200);
            response.send({ data: foundNotifications });
        } catch (error: unknown) {
            await this.logMongoError(error);
            response.status(500);
            response.send({ data: [] });
        } finally {
            await this.closeMongoTransaction();
        }
    };

    /** @inheritdoc */
    public removeNotification = async (
        request: NextApiRequest,
        response: NextApiResponse,
    ): Promise<void> => {
        try {
            await this.startMongoTransaction();

            const id = (JSON.parse(request.body) as { id: string }).id;

            if (id === undefined) {
                throw new Error("Must provide id when removing request");
            }

            const notificationRepo = this.getMongoRepo<Notification>(
                Collections.NOTIFICATIONS,
            );

            const removalResult = await notificationRepo.deleteOne({
                _id: new ObjectId(id),
            });

            response.status(removalResult.acknowledged ? 200 : 400);
            response.send({ data: removalResult.acknowledged });
        } catch (error: unknown) {
            await this.logMongoError(error);
            response.status(500);
            response.send({ data: false });
        } finally {
            await this.closeMongoTransaction();
        }
    };

    /** @inheritdoc */
    public validateSession = async (
        request: NextApiRequest,
        response: NextApiResponse,
    ): Promise<void> => {
        try {
            const { username } = parseCookie(request);

            if (username === undefined) {
                throw new Error("Session is invalid");
            }

            response.status(200);
            response.send({ data: true });
        } catch (error: unknown) {
            await this.logMongoError(error);
            response.status(401);
            response.send({ data: false });
        }
    };
}
