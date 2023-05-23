/* eslint-disable max-statements -- disabled */
/* eslint-disable camelcase -- disabled */

import { type MailDataRequired, MailService } from "@sendgrid/mail";
import { ObjectId } from "mongodb";
import type { NextApiRequest, NextApiResponse } from "next";

import type { AdminRequest, User } from "@/@types";
import {
    convertErrorToApiResponse,
    generateRequestAdminAccessLink,
    parseCookie,
    UserRoles,
} from "@/common";
import { Collections } from "@/constants";

import { DatabaseApi } from "../database";
import type { IAdminApi } from "./IAdminApi";

/**
 * All admin functionality in the application
 */
export class AdminApi extends DatabaseApi implements IAdminApi {
    /** @inheritdoc */
    public requestAdminAccess = async (
        request: NextApiRequest,
        response: NextApiResponse,
    ): Promise<void> => {
        try {
            const host = request.headers.host;
            const referrer = request.headers.referer;

            if (referrer === undefined || host === undefined) {
                throw new Error(
                    "Need host and referrer to send admin request emails",
                );
            }

            const isHttp = referrer?.startsWith("http");

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

            if (foundUser.role === UserRoles.ADMIN) {
                throw new Error("You already have admin access!");
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

            const confirmUrl = generateRequestAdminAccessLink(
                makeRequest.insertedId,
                username,
                `${isHttp ? "http://" : "https://"}${host}`,
            );

            const rejectUrl = generateRequestAdminAccessLink(
                makeRequest.insertedId,
                username,
                `${isHttp ? "http://" : "https://"}${host}`,
                false,
            );

            const [sendEmailResponse] = await sendgridClient.send({
                dynamicTemplateData: { confirmUrl, rejectUrl, username },
                from: {
                    email: process.env
                        .SENDGRID_ADMIN_TO_EMAIL as unknown as string,
                },
                templateId: process.env
                    .REQUEST_ADMIN_ACCESS_EMAIL_TEMPLATE_ID as unknown as string,
                to: {
                    email: process.env
                        .SENDGRID_ADMIN_TO_EMAIL as unknown as string,
                },
            } as MailDataRequired);

            response.send({ data: sendEmailResponse.statusCode === 202 });
        } catch (error: unknown) {
            await this.logMongoError(error);
            response.status(500);
            response.send(convertErrorToApiResponse(error, false));
        } finally {
            await this.closeMongoTransaction();
        }
    };

    /** @inheritdoc */
    public confirmAdminAccess = async (
        request: NextApiRequest,
        response: NextApiResponse,
    ): Promise<void> => {
        try {
            await this.startMongoTransaction();

            const id = request.query.id as string;

            if (id === undefined) {
                throw new Error(
                    "Failed to parse id from query string in confirming",
                );
            }

            const requestRepo = this.getMongoRepo<AdminRequest>(
                Collections.ADMIN_REQUESTS,
            );

            const foundRequest = await requestRepo.findOne({
                _id: new ObjectId(id),
            });

            if (foundRequest === null) {
                throw new Error("Unable to find request to confirm");
            }

            const { user_id } = foundRequest;

            const deleteResult = await requestRepo.deleteOne(foundRequest);

            const userRepo = this.getMongoRepo<User>(Collections.USERS);

            const updateResult = await userRepo.updateOne(
                { _id: user_id },
                { $set: { role: UserRoles.ADMIN } },
            );

            response.status(
                deleteResult.acknowledged && updateResult.acknowledged
                    ? 200
                    : 400,
            );
            response.send({
                data: deleteResult.acknowledged && updateResult.acknowledged,
            });
        } catch (error: unknown) {
            await this.logMongoError(error);
            response.status(500);
            response.send(convertErrorToApiResponse(error, false));
        } finally {
            await this.closeMongoTransaction();
        }
    };

    /** @inheritdoc */
    public rejectAdminAccess = async (
        request: NextApiRequest,
        response: NextApiResponse,
    ): Promise<void> => {
        try {
            await this.startMongoTransaction();

            const id = request.query.id as string;

            if (id === undefined || id.length === 0) {
                throw new Error(
                    "Failed to parse id from query string in rejecting",
                );
            }

            const requestRepo = this.getMongoRepo<AdminRequest>(
                Collections.ADMIN_REQUESTS,
            );

            const foundRequest = await requestRepo.findOne({
                _id: new ObjectId(id),
            });

            if (foundRequest === null) {
                throw new Error("Request unable to be found");
            }

            const deleteResult = await requestRepo.deleteOne(foundRequest);

            response.status(deleteResult.acknowledged ? 200 : 400);
            response.send({ data: deleteResult.acknowledged });
        } catch (error: unknown) {
            await this.logMongoError(error);
            response.status(500);
            response.send(convertErrorToApiResponse(error, false));
        } finally {
            await this.closeMongoTransaction();
        }
    };
}
