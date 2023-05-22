import type { ObjectId } from "mongodb";

export type AdminRequest = {
    user_id: ObjectId;
    requestedAt: Date;
};
