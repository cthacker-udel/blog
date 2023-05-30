/* eslint-disable @typescript-eslint/indent -- disabled */
import { ObjectId } from "mongodb";
import type { NextApiRequest, NextApiResponse } from "next";

import type { Post, UpdatePostPayload, User } from "@/@types";
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

    /** @inheritdoc */
    public allAuthoredPosts = async (
        request: NextApiRequest,
        response: NextApiResponse,
    ): Promise<void> => {
        try {
            await this.startMongoTransaction();

            const postRepo = this.getMongoRepo<Post>(Collections.POSTS);
            const userRepo = this.getMongoRepo<User>(Collections.USERS);

            const { username } = parseCookie(request);

            if (username === undefined) {
                throw new Error("Session cookie must be included in request");
            }

            const foundUser = await userRepo.findOne({ username });

            if (foundUser === null) {
                throw new Error("User does not exist");
            }

            const allAuthoredPosts = await postRepo
                .find({
                    author: foundUser._id,
                })
                .toArray();

            response.status(200);
            response.send({ data: allAuthoredPosts });
        } catch (error: unknown) {
            await this.logMongoError(error);
            response.status(500);
            response.send(convertErrorToApiResponse(error, false));
        } finally {
            await this.closeMongoTransaction();
        }
    };

    /** @inheritdoc */
    public ssGetPostDetails = async (
        postId: string,
    ): Promise<
        Partial<Pick<Post, "createdAt" | "title"> & { authorUsername: string }>
    > => {
        try {
            await this.startMongoTransaction();

            const postRepo = this.getMongoRepo<Post>(Collections.POSTS);
            const userRepo = this.getMongoRepo<User>(Collections.USERS);

            if (postId === undefined) {
                throw new Error("Must include post id in the body");
            }

            const foundPost = await postRepo.findOne({
                _id: new ObjectId(postId),
            });

            if (foundPost === null) {
                throw new Error("Post does not exist");
            }

            const { author: authorId, createdAt, title } = foundPost;

            const foundUser = await userRepo.findOne({ _id: authorId });

            if (foundUser === null) {
                throw new Error("Author of post does not exist");
            }

            const { username } = foundUser;

            return { authorUsername: username, createdAt, title };
        } catch (error: unknown) {
            await this.logMongoError(error);
        } finally {
            await this.closeMongoTransaction();
        }
        return {};
    };

    /** @inheritdoc */
    public getPostContent = async (
        request: NextApiRequest,
        response: NextApiResponse,
    ): Promise<void> => {
        try {
            await this.startMongoTransaction();

            const postId = request.query.postId;

            if (postId === undefined) {
                throw new Error("Post id must be supplied in query string");
            }

            const postRepo = this.getMongoRepo<Post>(Collections.POSTS);

            const foundPost = await postRepo.findOne({
                _id: new ObjectId(postId as string),
            });

            if (foundPost === null) {
                throw new Error("Post was unable to be found");
            }

            response.status(200);
            response.send({ data: foundPost.content ?? "" });
        } catch (error: unknown) {
            await this.logMongoError(error);
            response.status(500);
            response.send(convertErrorToApiResponse(error, false));
        } finally {
            await this.closeMongoTransaction();
        }
    };

    /** @inheritdoc */
    public updateContent = async (
        request: NextApiRequest,
        response: NextApiResponse,
    ): Promise<void> => {
        try {
            await this.startMongoTransaction();

            const { htmlContent, id, textContent, title } = JSON.parse(
                request.body,
            ) as UpdatePostPayload;

            if (
                htmlContent === undefined ||
                textContent === undefined ||
                id === undefined ||
                title === undefined
            ) {
                throw new Error(
                    "Cannot update content without necessary fields sent",
                );
            }

            const postRepo = this.getMongoRepo<Post>(Collections.POSTS);

            const foundPost = await postRepo.findOne({ _id: new ObjectId(id) });

            if (foundPost === null) {
                throw new Error("Post is not in database");
            }

            const updateResult = await postRepo.updateOne(
                { _id: foundPost._id },
                {
                    $set: {
                        content: htmlContent,
                        modifiedAt: new Date(Date.now()),
                        textContent,
                        title,
                    },
                },
            );

            response.status(updateResult.acknowledged ? 200 : 400);
            response.send({ data: updateResult.acknowledged ? 200 : 400 });
        } catch (error: unknown) {
            await this.logMongoError(error);
            response.status(500);
            response.send(convertErrorToApiResponse(error, false));
        } finally {
            await this.closeMongoTransaction();
        }
    };

    /** @inheritdoc */
    public getMostRecentPosts = async (
        _request: NextApiRequest,
        response: NextApiResponse,
    ): Promise<void> => {
        try {
            await this.startMongoTransaction();

            const postRepo = this.getMongoRepo<Post>(Collections.POSTS);

            const mostRecentPosts = await postRepo
                .find()
                .sort({ modifiedAt: -1 })
                .toArray();

            response.status(200);
            response.send({ data: mostRecentPosts });
        } catch (error: unknown) {
            await this.logMongoError(error);
            response.status(500);
            response.send(convertErrorToApiResponse(error, false));
        } finally {
            await this.closeMongoTransaction();
        }
    };
}
