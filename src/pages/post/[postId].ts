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
    isAuthor: boolean;
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
        const isAuthor = await new PostApi().isAuthorOfPost(
            userId,
            new ObjectId(postId as string),
        );

        return { props: { isAuthor, userId: userId.toString() } };
    } catch {
        return { redirect: { destination: "/", permanent: false } };
    }
};

export { Post as default } from "@/modules";
