/* eslint-disable @typescript-eslint/indent -- disabled */
/* eslint-disable import/no-nodejs-modules -- disabled */

import type { IncomingMessage } from "node:http";
import type { ParsedUrlQuery } from "node:querystring";

import { ObjectId } from "mongodb";
import type { GetServerSideProps, NextApiRequest } from "next";

import { UserApi } from "@/api/server";
import { PostApi } from "@/api/server/post";
import { parseCookie } from "@/common";

type GetServerSideProperties = {
    req: IncomingMessage;
    query: ParsedUrlQuery;
};

type PostProperties = {
    authorUsername?: string;
    createdAt: string;
    dislikes?: string[];
    isAuthor: boolean;
    likes?: string[];
    title?: string;
    userId: string;
};

/**
 * Gets the server side properties of the Post component, pulling the current user id in from the username
 * to see if the user is the author or not
 */
export const getServerSideProps: GetServerSideProps<PostProperties> = async ({
    req,
    query,
}: GetServerSideProperties) => {
    try {
        const { username } = parseCookie(req as NextApiRequest);
        const { postId } = query;

        if (username === undefined) {
            return { redirect: { destination: "/", permanent: false } };
        }

        const userId = await new UserApi().getUserIdFromUsername(username);
        const { dislikes: foundDislikes, likes: foundLikes } =
            await new UserApi().getLikesAndDislikes(username);
        const isAuthor = await new PostApi().isAuthorOfPost(
            userId,
            new ObjectId(postId as string),
        );
        const postDetails = await new PostApi().ssGetPostDetails(
            postId as string,
        );

        const createdAt = new Date(
            postDetails.createdAt ?? Date.now(),
        ).toUTCString();

        const dislikes =
            foundDislikes === undefined
                ? []
                : foundDislikes.map((eachId) =>
                      eachId.toString().toLowerCase(),
                  );

        const likes =
            foundLikes === undefined
                ? []
                : foundLikes.map((eachId) => eachId.toString().toLowerCase());

        return {
            props: {
                dislikes,
                isAuthor,
                likes,
                userId: userId.toString(),
                ...postDetails,
                createdAt,
            },
        };
    } catch {
        return { redirect: { destination: "/", permanent: false } };
    }
};

export { Post as default } from "@/modules";
