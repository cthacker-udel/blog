/* eslint-disable @typescript-eslint/indent -- disabled */
import { ObjectId } from "mongodb";

import { Collections } from "@/constants";

import { DatabaseApi } from "../database";
import type { INotificationApi } from "./INotificationApi";

/**
 * The notification api, where all the notifications are added/removed
 */
export class NotificationApi extends DatabaseApi implements INotificationApi {
    /** @inheritdoc */
    public addNotification = async (
        notification: Notification,
        databaseClient?: DatabaseApi,
    ): Promise<boolean> => {
        try {
            if (databaseClient === undefined) {
                await this.startMongoTransaction();
            }

            const notificationRepo =
                databaseClient === undefined
                    ? this.getMongoRepo<Notification>(Collections.NOTIFICATIONS)
                    : databaseClient.getMongoRepo<Notification>(
                          Collections.NOTIFICATIONS,
                      );

            const insertResult = await notificationRepo.insertOne(notification);
            return insertResult.acknowledged;
        } catch (error: unknown) {
            await this.logMongoError(error);
        } finally {
            await this.closeMongoTransaction();
        }
        return false;
    };

    /** @inheritdoc */
    public removeNotification = async (
        id: string,
        databaseClient?: DatabaseApi,
    ): Promise<boolean> => {
        try {
            if (databaseClient === undefined) {
                await this.startMongoTransaction();
            }

            const notificationRepo =
                databaseClient === undefined
                    ? this.getMongoRepo<Notification>(Collections.NOTIFICATIONS)
                    : databaseClient.getMongoRepo<Notification>(
                          Collections.NOTIFICATIONS,
                      );

            const convertedId = new ObjectId(id);

            const removeNotification = await notificationRepo.deleteOne({
                _id: convertedId,
            });

            return removeNotification.acknowledged;
        } catch (error: unknown) {
            await this.logMongoError(error);
        } finally {
            await this.closeMongoTransaction();
        }
        return false;
    };
}
