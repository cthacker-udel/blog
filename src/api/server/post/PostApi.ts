/* eslint-disable max-statements -- disabled (only went 2/3 over) */
/* eslint-disable no-confusing-arrow -- disabled */
/* eslint-disable @typescript-eslint/indent -- disabled */
import { ObjectId } from "mongodb";
import type { NextApiRequest, NextApiResponse } from "next";

import type {
    AddCommentPayload,
    Comment,
    CommentWithUsername,
    MostRecentPost,
    Post,
    UpdatePostPayload,
    User,
} from "@/@types";
import { convertErrorToApiResponse, parseCookie, ReactionType } from "@/common";
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
            const userRepo = this.getMongoRepo<User>(Collections.USERS);

            const mostRecentPosts = await postRepo
                .find()
                .sort({ modifiedAt: -1 })
                .toArray();

            const findMongoUsers: Promise<User | null>[] = [];

            for (const eachPost of mostRecentPosts) {
                findMongoUsers.push(userRepo.findOne({ _id: eachPost.author }));
            }

            const foundUsers = await Promise.all(findMongoUsers);
            const foundUsersUsernames = foundUsers
                .filter(Boolean)
                .map((eachUser) =>
                    eachUser === null ? "" : eachUser.username,
                );

            const modifiedPosts: MostRecentPost[] = mostRecentPosts.map(
                (eachPost: Post, eachPostIndex: number) => ({
                    ...eachPost,
                    username: foundUsersUsernames[eachPostIndex],
                }),
            );

            response.status(200);
            response.send({ data: modifiedPosts });
        } catch (error: unknown) {
            await this.logMongoError(error);
            response.status(500);
            response.send(convertErrorToApiResponse(error, false));
        } finally {
            await this.closeMongoTransaction();
        }
    };

    /** @inheritdoc */
    public addComment = async (
        request: NextApiRequest,
        response: NextApiResponse,
    ): Promise<void> => {
        try {
            await this.startMongoTransaction();

            const { username } = parseCookie(request);

            if (username === undefined) {
                throw new Error("Sent invalid cookie");
            }

            const userRepo = this.getMongoRepo<User>(Collections.USERS);

            const foundUser = await userRepo.findOne({ username });

            if (foundUser === null) {
                throw new Error("User making request does not exist");
            }

            const commentRepo = this.getMongoRepo<Comment>(
                Collections.COMMENTS,
            );
            const postRepo = this.getMongoRepo<Post>(Collections.POSTS);

            const { comment, postId } = JSON.parse(
                request.body,
            ) as AddCommentPayload;

            if (comment === undefined || postId === undefined) {
                throw new Error(
                    "Must supply valid values when sending post request to add comment to a post",
                );
            }

            const foundPost = await postRepo.findOne({
                _id: new ObjectId(postId),
            });

            if (foundPost === null) {
                throw new Error(
                    "Post that is receiving comment does not exist in database",
                );
            }

            const createComment = await commentRepo.insertOne({
                author: foundUser._id,
                comment,
                createdAt: new Date(Date.now()),
                dislikes: 0,
                likes: 0,
                modifiedAt: new Date(Date.now()),
            });

            if (!createComment.acknowledged) {
                throw new Error("Unable to create comment");
            }

            const createdCommentId = createComment.insertedId;

            const updatePostResult = await postRepo.updateOne(
                { _id: new ObjectId(postId) },
                {
                    $set: {
                        comments:
                            foundPost.comments === undefined
                                ? [new ObjectId(createdCommentId)]
                                : [
                                      ...foundPost.comments,
                                      new ObjectId(createdCommentId),
                                  ],
                    },
                },
            );

            response.status(200);
            response.send({
                data: [updatePostResult.acknowledged, createdCommentId],
            });
        } catch (error: unknown) {
            await this.logMongoError(error);
            response.status(500);
            response.send(convertErrorToApiResponse(error, [false, undefined]));
        } finally {
            await this.closeMongoTransaction();
        }
    };

    /** @inheritdoc */
    public allComments = async (
        request: NextApiRequest,
        response: NextApiResponse,
    ): Promise<void> => {
        try {
            await this.startMongoTransaction();

            const { postId } = request.query;

            if (postId === undefined) {
                throw new Error("Must supply post id when fetching comments");
            }

            const postRepo = this.getMongoRepo<Post>(Collections.POSTS);
            const commentRepo = this.getMongoRepo<Comment>(
                Collections.COMMENTS,
            );
            const userRepo = this.getMongoRepo<User>(Collections.USERS);

            const foundPost = await postRepo.findOne({
                _id: new ObjectId(postId as string),
            });

            if (foundPost === null) {
                throw new Error("Find post comments was invalid");
            }

            const allPostComments = foundPost.comments;

            if (allPostComments === undefined) {
                response.status(200);
                response.send({ data: [] });
            } else {
                const findingComments: Promise<Comment | null>[] = [];

                for (const eachCommentId of allPostComments) {
                    findingComments.push(
                        commentRepo.findOne({ _id: eachCommentId }),
                    );
                }

                const foundComments = await Promise.all(findingComments);
                const filteredComments = foundComments.filter(
                    (eachComment) => eachComment !== null,
                ) as Comment[];

                const findingCommentUsernames: Promise<User | null>[] = [];

                for (const eachFilteredComment of filteredComments) {
                    findingCommentUsernames.push(
                        userRepo.findOne(
                            { _id: eachFilteredComment.author },
                            { projection: { username: 1 } },
                        ),
                    );
                }

                const foundCommentUsernames = await Promise.all(
                    findingCommentUsernames,
                );

                const filteredCommentUsernames = foundCommentUsernames.filter(
                    (eachUser) => eachUser !== null,
                ) as User[];

                const modifiedFilteredComments = filteredComments.map(
                    (eachComment: Comment, eachCommentIndex: number) =>
                        ({
                            ...eachComment,
                            username:
                                filteredCommentUsernames[eachCommentIndex]
                                    .username,
                        } as CommentWithUsername),
                );

                response.status(200);
                response.send({ data: modifiedFilteredComments });
            }
        } catch (error: unknown) {
            await this.logMongoError(error);
            response.status(500);
            response.send(convertErrorToApiResponse(error, []));
        } finally {
            await this.closeMongoTransaction();
        }
    };

    /** @inheritdoc */
    public reactComment = async (
        request: NextApiRequest,
        response: NextApiResponse,
    ): Promise<void> => {
        try {
            await this.startMongoTransaction();

            const { commentId, reactionType } = request.query;

            if (commentId === undefined || reactionType === undefined) {
                throw new Error(
                    "Must include proper query parameters when reacting to comment",
                );
            }

            const { username } = parseCookie(request);

            if (username === undefined) {
                throw new Error("Invalid cookie");
            }

            const userRepo = this.getMongoRepo<User>(Collections.USERS);
            const commentRepo = this.getMongoRepo<Comment>(
                Collections.COMMENTS,
            );

            const foundUser = await userRepo.findOne({ username });
            const foundComment = await commentRepo.findOne({
                _id: new ObjectId(commentId as string),
            });

            if (foundUser === null) {
                throw new Error(
                    "User associated with session token could not be found",
                );
            }

            if (foundComment === null) {
                throw new Error(
                    "Comment ID does not correlate to comment in the database",
                );
            }

            const likes = [...(foundUser.likes ?? [])];
            const dislikes = [...(foundUser.dislikes ?? [])];
            let { dislikes: foundCommentDislikes, likes: foundCommentLikes } =
                foundComment;

            const convertedEnum = Number.parseInt(
                reactionType as string,
                10,
            ) as ReactionType;

            const doesLikeExist = likes.findIndex(
                (eachLikeObjectId) =>
                    eachLikeObjectId.toString().toLowerCase() ===
                    (commentId as string).toLowerCase(),
            );
            const doesDislikeExist = dislikes.findIndex(
                (eachDislikeObjectId) =>
                    eachDislikeObjectId.toString().toLowerCase() ===
                    (commentId as string).toLowerCase(),
            );

            if (convertedEnum === ReactionType.LIKE) {
                if (doesLikeExist === -1) {
                    likes.push(new ObjectId(commentId as string));
                    foundCommentLikes += 1;
                } else {
                    likes.splice(doesLikeExist, 1);
                    foundCommentLikes -= 1;
                }

                if (doesDislikeExist !== -1) {
                    dislikes.splice(doesDislikeExist, 1);
                    foundCommentDislikes -= 1;
                }
            } else if (convertedEnum === ReactionType.DISLIKE) {
                if (doesDislikeExist === -1) {
                    dislikes.push(new ObjectId(commentId as string));
                    foundCommentDislikes += 1;
                } else {
                    dislikes.splice(doesDislikeExist, 1);
                    foundCommentDislikes -= 1;
                }

                if (doesLikeExist !== -1) {
                    likes.splice(doesLikeExist, 1);
                    foundCommentLikes -= 1;
                }
            }

            const userUpdateResult = await userRepo.updateOne(
                { _id: foundUser._id },
                {
                    $set: {
                        dislikes,
                        likes,
                    },
                },
            );

            const updatedComment = await commentRepo.updateOne(
                { _id: new ObjectId(commentId as string) },
                {
                    $set: {
                        dislikes: foundCommentDislikes,
                        likes: foundCommentLikes,
                    },
                },
            );

            response.status(
                userUpdateResult.acknowledged && updatedComment.acknowledged
                    ? 200
                    : 400,
            );
            response.send({
                data:
                    userUpdateResult.acknowledged &&
                    updatedComment.acknowledged,
            });
        } catch (error: unknown) {
            await this.logMongoError(error);
            response.status(500);
            response.send(convertErrorToApiResponse(error, false));
        } finally {
            await this.closeMongoTransaction();
        }
    };
}
