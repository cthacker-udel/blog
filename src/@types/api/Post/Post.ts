import type { ObjectId } from "mongodb";

export type Post = {
    author: ObjectId;
    createdAt: Date;
    modifiedAt: Date;
    title: string;
};
