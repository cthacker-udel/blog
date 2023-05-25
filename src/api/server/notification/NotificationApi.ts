/* eslint-disable @typescript-eslint/indent -- disabled */
import { ObjectId } from "mongodb";

import type { Notification } from "@/classes";
import { Collections } from "@/constants";

import { DatabaseApi } from "../database";
import type { INotificationApi } from "./INotificationApi";

/**
 * The notification api, where all the notifications are added/removed
 */
export class NotificationApi implements INotificationApi {
    /**
     * The database api instance
     */
    public databaseApi: DatabaseApi;

    /**
     * Whether the database api was passed in or not, controls whether we start mongo
     * transactions or not
     */
    public notPassedIn: boolean;

    /**
     * One-arg constructor (arg is optional).
     * Instantiates the database api class with the instance passed in, or a new one if an instance is not supplied
     *
     * @param _databaseApi - The database api passed in, can be used from a service or standalone
     */
    public constructor(_databaseApi?: DatabaseApi) {
        this.notPassedIn = _databaseApi === undefined;
        this.databaseApi = _databaseApi ?? new DatabaseApi();
    }

    /** @inheritdoc */
    public addNotification = async (
        notification: Notification,
    ): Promise<boolean> => {
        try {
            if (this.notPassedIn) {
                await this.databaseApi.startMongoTransaction();
            }

            const notificationRepo =
                this.databaseApi.getMongoRepo<Notification>(
                    Collections.NOTIFICATIONS,
                );

            const insertResult = await notificationRepo.insertOne(notification);
            return insertResult.acknowledged;
        } catch (error: unknown) {
            await this.databaseApi.logMongoError(error);
        } finally {
            if (this.notPassedIn) {
                await this.databaseApi.closeMongoTransaction();
            }
        }
        return false;
    };

    /** @inheritdoc */
    public removeNotification = async (id: string): Promise<boolean> => {
        try {
            if (this.notPassedIn) {
                await this.databaseApi.startMongoTransaction();
            }

            const notificationRepo =
                this.databaseApi.getMongoRepo<Notification>(
                    Collections.NOTIFICATIONS,
                );

            const convertedId = new ObjectId(id);

            const removeNotification = await notificationRepo.deleteOne({
                _id: convertedId,
            });

            return removeNotification.acknowledged;
        } catch (error: unknown) {
            await this.databaseApi.logMongoError(error);
        } finally {
            if (this.notPassedIn) {
                await this.databaseApi.closeMongoTransaction();
            }
        }
        return false;
    };
}
