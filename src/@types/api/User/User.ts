import type { ObjectId } from "mongodb";

import type { UserRoles } from "@/common";

export type User = {
    _id?: ObjectId;
    createdAt: Date;
    updatedAt: Date;
    username: string;
    password: string;
    passwordSalt: string;
    profilePictureUrl?: string;
    role: UserRoles;
    likes?: ObjectId[];
    dislikes?: ObjectId[];
};
