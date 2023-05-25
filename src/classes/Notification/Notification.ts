import { ObjectId } from "mongodb";

import { NotificationType } from "@/common";

/**
 * Represents a notification in the database + client side
 */
export class Notification {
    /**
     * When the notification was created
     */
    public createdAt: Date;

    /**
     * The ObjectID of the receiver (the _id field of the entry in the database)
     */
    public receiver: ObjectId;

    /**
     * The contents of the notification
     */
    public message: string;

    /**
     * The type of notification
     */
    public type: NotificationType;

    /**
     * Constructs a notification given the arguments (type is optional)
     *
     * @param receiver - The receiver (person who is receiving the notification)
     * @param message - The message of the notification (the content)
     * @param type - The type of notification (error, info, etc)
     */
    public constructor(
        receiver: string,
        message?: string,
        type?: NotificationType,
    ) {
        this.createdAt = new Date(Date.now());
        this.receiver = new ObjectId(receiver);
        this.message = message ?? "";
        this.type = type ?? NotificationType.INFO;
    }

    /**
     * Sets the notification's type
     *
     * @param type - The new type to set
     * @returns The modified instance
     */
    public setType = (type: NotificationType): this => {
        this.type = type;
        return this;
    };

    /**
     * Sets the notification's created at date
     *
     * @param createdAt - The new created at date to set
     * @returns The modified instance
     */
    public setCreatedAt = (createdAt: Date): this => {
        this.createdAt = createdAt;
        return this;
    };

    /**
     * Sets the notification's message
     *
     * @param message - The new message to set
     * @returns The modified instance
     */
    public setMessage = (message: string): this => {
        this.message = message;
        return this;
    };

    /**
     * Sets the notification's receiver
     *
     * @param receiver - The new receiver to set
     * @returns The modified instance
     */
    public setReceiver = (receiver: string): this => {
        this.receiver = new ObjectId(receiver);
        return this;
    };
}
