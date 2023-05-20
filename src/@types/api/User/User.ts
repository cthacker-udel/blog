import type { ObjectId } from "mongodb";

export type User = {
    _id?: ObjectId;
    createdAt: Date;
    updatedAt: Date;
    username: string;
    password: string;
    passwordSalt: string;
    profilePictureUrl?: string;
};
