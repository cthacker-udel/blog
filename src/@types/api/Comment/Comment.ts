import type { ObjectId } from "mongodb";

export type Comment = {
    _id?: ObjectId;
    author: ObjectId;
    comment: string;
    createdAt: Date;
    dislikes: number;
    likes: number;
    modifiedAt: Date;
};
