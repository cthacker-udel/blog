import Head from "next/head";
import { useRouter } from "next/router";
import React from "react";

import { useBackground } from "@/hooks";

import styles from "./Post.module.css";

type PostProperties = {
    createdAt: string;
    isAuthor: boolean;
    title: string;
    userId: string;
};

/**
 * Page that displays the current post being viewed
 *
 * @returns The current post being viewed
 */
export const Post = ({
    createdAt,
    isAuthor,
    title,
    userId,
}: PostProperties): JSX.Element => {
    const router = useRouter();
    useBackground({
        imageConfig: {
            background:
                "linear-gradient(0deg, rgba(34,162,195,1) 0%, rgba(253,121,45,1) 100%)",
        },
    });

    const { postId } = router.query;

    if (postId === undefined) {
        return <div />;
    }

    return (
        <>
            <Head>
                <title>{title}</title>
            </Head>
            <div className={styles.post_content}>
                <div className={styles.post_title}>{title}</div>
                {postId}
                {isAuthor ? "\tIs author\t" : "\tIs not author\t"}
                {userId}
                {title}
                {createdAt}
            </div>
        </>
    );
};
