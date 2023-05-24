import type { ObjectId } from "mongodb";
import type { NextApiRequest, NextApiResponse } from "next";

import type { Post, User } from "@/@types";
import { convertErrorToApiResponse, parseCookie } from "@/common";
import { Collections } from "@/constants";

import { DatabaseApi } from "../database";
import type { IPostApi } from "./IPostApi";

/**
 * Server-side post api implementation
 */
export class PostApi extends DatabaseApi implements IPostApi {
    /** @inheritdoc */
    public addPost = async (
        request: NextApiRequest,
        response: NextApiResponse,
    ): Promise<void> => {
        try {
            await this.startMongoTransaction();

            const { title } = JSON.parse(request.body) as Pick<Post, "title">;

            const { username } = parseCookie(request);

            const userRepo = this.getMongoRepo<User>(Collections.USERS);
            const postRepo = this.getMongoRepo<Post>(Collections.POSTS);

            const foundUser = await userRepo.findOne({ username });

            if (foundUser === null) {
                throw new Error("User does not exist");
            }

            const doesPostAlreadyExist = await postRepo.findOne({
                author: foundUser._id,
                title,
            });

            if (doesPostAlreadyExist !== null) {
                throw new Error("Post already exists");
            }

            const createPostResult = await postRepo.insertOne({
                author: foundUser._id,
                createdAt: new Date(Date.now()),
                modifiedAt: new Date(Date.now()),
                title,
            });

            response.status(createPostResult.acknowledged ? 200 : 400);
            response.send({ data: createPostResult.insertedId });
        } catch (error: unknown) {
            await this.logMongoError(error);
            response.status(500);
            response.send(convertErrorToApiResponse(error, false));
        } finally {
            await this.closeMongoTransaction();
        }
    };

    /** @inheritdoc */
    public isAuthorOfPost = async (
        userId: ObjectId,
        postId: ObjectId,
    ): Promise<boolean> => {
        try {
            await this.startMongoTransaction();

            const postRepo = this.getMongoRepo<Post>(Collections.POSTS);

            const foundPost = await postRepo.findOne({
                _id: postId,
                author: userId,
            });

            return foundPost !== null;
        } catch (error: unknown) {
            await this.logMongoError(error);
            return false;
        } finally {
            await this.closeMongoTransaction();
        }
    };
}
