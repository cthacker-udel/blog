import type { Notification } from "@/classes";

export interface INotificationApi {
    /**
     * Adds a notification to the database (mongo database)
     *
     * @param _notification - The notification to add
     * @returns Whether the notification was added successfully
     */
    addNotification: (_notification: Notification) => Promise<boolean>;

    /**
     * Removes a notification from the database
     *
     * @param _id - The id of the notification to remove
     * @returns Whether the notification was removed successfully
     */
    removeNotification: (_id: string) => Promise<boolean>;
}
