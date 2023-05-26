/* eslint-disable @typescript-eslint/indent -- disabled */
/* eslint-disable @typescript-eslint/no-floating-promises -- disabled */

import Head from "next/head";
import { useRouter } from "next/router";
import React from "react";
import { Button, OverlayTrigger } from "react-bootstrap";
import type { OverlayInjectedProps } from "react-bootstrap/esm/Overlay";
import useSWR from "swr";

import type { ApiResponse, Post as PostType } from "@/@types";
import { generateTooltip } from "@/common";
import { Endpoints } from "@/constants";
import { useBackground } from "@/hooks";

import { EditPostModal } from "./EditPostModal";
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
    const [editPost, setEditPost] = React.useState<boolean>(false);

    const toggleEditPost = React.useCallback(() => {
        setEditPost((oldValue: boolean) => !oldValue);
    }, []);

    const { postId } = router.query;

    const { data, error, isLoading } = useSWR<
        ApiResponse<Pick<PostType, "content">>,
        Error,
        string
    >(`${Endpoints.POST.BASE}${Endpoints.POST.CONTENT}?postId=${postId}`);

    if (postId === undefined || isLoading || data === undefined) {
        return <div />;
    }

    if (error) {
        router.push("/");
    }

    const {
        data: { content: postContent },
    } = data;

    console.log(postContent);

    return (
        <>
            <Head>
                <title>{title}</title>
            </Head>
            <div className={styles.post_content}>
                <div className={styles.post_title}>
                    {title}
                    {isAuthor && (
                        <OverlayTrigger
                            overlay={(
                                properties: OverlayInjectedProps,
                            ): JSX.Element =>
                                generateTooltip({
                                    content: editPost
                                        ? "Cancel Edit"
                                        : "Edit Post",
                                    props: properties,
                                })
                            }
                            placement="top"
                        >
                            <Button
                                className={styles.edit_post_button}
                                onClick={toggleEditPost}
                                variant="outline-primary"
                            >
                                <i
                                    className={`fa-solid ${
                                        editPost ? "fa-cancel" : "fa-pencil"
                                    } fa-xs`}
                                />
                            </Button>
                        </OverlayTrigger>
                    )}
                </div>
                {postId}
                {isAuthor ? "\tIs author\t" : "\tIs not author\t"}
                {userId}
                {title}
                {createdAt}
            </div>
            <EditPostModal
                content={postContent}
                onHideEditPostModal={toggleEditPost}
                postId={postId as string}
                showEditPostModal={editPost}
                title={title}
            />
        </>
    );
};
