import { useRouter } from "next/router";
import React from "react";

type PostProperties = {
    isAuthor: boolean;
    userId: string;
};

/**
 * Page that displays the current post being viewed
 *
 * @returns The current post being viewed
 */
export const Post = ({ isAuthor, userId }: PostProperties): JSX.Element => {
    const router = useRouter();

    const { postId } = router.query;

    if (postId === undefined) {
        return <div />;
    }

    return (
        <div>
            {postId}
            {isAuthor ? "\tIs author\t" : "\tIs not author\t"}
            {userId}
        </div>
    );
};
