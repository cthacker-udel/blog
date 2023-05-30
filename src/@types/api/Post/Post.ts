import type { ObjectId } from "mongodb";

export type Post = {
    _id?: ObjectId;
    author: ObjectId;
    createdAt: Date;
    content?: string;
    modifiedAt: Date;
    textContent?: string;
    title: string;
};
