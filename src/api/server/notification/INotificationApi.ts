import type { DatabaseApi } from "../database";

export interface INotificationApi {
    /**
     * Adds a notification to the database (mongo database)
     *
     * @param _notification - The notification to add
     * @param _databaseClient - The database client, to avoid restarting mongo transactions
     * @returns Whether the notification was added successfully
     */
    addNotification: (
        _notification: Notification,
        _databaseClient?: DatabaseApi,
    ) => Promise<boolean>;

    /**
     * Removes a notification from the database
     *
     * @param _id - The id of the notification to remove
     * @param _databaseClient - The database client, to avoid restarting mongo transactions
     * @returns Whether the notification was removed successfully
     */
    removeNotification: (
        _id: string,
        _databaseClient?: DatabaseApi,
    ) => Promise<boolean>;
}
