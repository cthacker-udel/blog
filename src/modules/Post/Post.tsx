/* eslint-disable react/no-danger -- disabled */
/* eslint-disable unicorn/no-null -- disabled */
/* eslint-disable @typescript-eslint/indent -- disabled */
/* eslint-disable @typescript-eslint/no-floating-promises -- disabled */

import Head from "next/head";
import { useRouter } from "next/router";
import React from "react";
import { Button, OverlayTrigger } from "react-bootstrap";
import type { OverlayInjectedProps } from "react-bootstrap/esm/Overlay";
import useSWR from "swr";

import type { ApiResponse } from "@/@types";
import { generateTooltip } from "@/common";
import { Endpoints } from "@/constants";
import { useBackground } from "@/hooks";

import { EditPostModal } from "./EditPostModal";
import styles from "./Post.module.css";

type PostProperties = {
    authorUsername: string;
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
    authorUsername,
    createdAt: _createdAt,
    isAuthor,
    title,
    userId: _userId,
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

    const { data, error, isLoading, mutate } = useSWR<
        ApiResponse<string>,
        Error,
        string
    >(
        `${Endpoints.POST.BASE}${Endpoints.POST.CONTENT}?postId=${postId}`,
        null,
        {
            onSuccess: (fetchedData: ApiResponse<string>) => {
                const element = document.querySelector(
                    "#post_content_container",
                );

                if (element !== null) {
                    const { data: postContent } = fetchedData;
                    element.innerHTML = postContent;
                }
            },
        },
    );

    const mutateContent = React.useCallback(
        async (updatedContent: string): Promise<void> => {
            await mutate({ data: updatedContent } as ApiResponse<string>, {
                optimisticData: { data: updatedContent },
                revalidate: false,
            });
        },
        [mutate],
    );

    if (postId === undefined || isLoading || data === undefined) {
        return <div />;
    }

    const { data: postContent } = data;

    if (error) {
        router.push("/");
    }

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
                <div
                    className={styles.post_content_container}
                    dangerouslySetInnerHTML={{ __html: postContent }}
                    id="post_content_container"
                />
                <div className={styles.post_credits}>
                    {"Created by "}
                    <span className={styles.post_author_username}>
                        {authorUsername ?? "N/A"}
                    </span>
                    {` at ${new Date(_createdAt).toLocaleString()}`}
                </div>
            </div>
            <EditPostModal
                content={postContent}
                mutateContent={mutateContent}
                onHideEditPostModal={toggleEditPost}
                postId={postId as string}
                showEditPostModal={editPost}
                title={title}
            />
        </>
    );
};
