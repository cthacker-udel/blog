/* eslint-disable react/no-danger -- disabled */
/* eslint-disable unicorn/no-null -- disabled */
/* eslint-disable @typescript-eslint/indent -- disabled */
/* eslint-disable @typescript-eslint/no-floating-promises -- disabled */

import Head from "next/head";
import { useRouter } from "next/router";
import React from "react";
import { Button, Form, InputGroup, OverlayTrigger } from "react-bootstrap";
import type { OverlayInjectedProps } from "react-bootstrap/esm/Overlay";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import sanitize from "sanitize-html";
import useSWR from "swr";
import { Key } from "ts-key-enum";

import type { ApiResponse } from "@/@types";
import { PostService } from "@/api/service/post";
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

type FormValues = {
    comment: string;
};

const FORM_DEFAULT_VALUES: FormValues = {
    comment: "",
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
    const [currentTitle, setCurrentTitle] = React.useState<string>(title);
    const { formState, getValues, register, reset } = useForm<FormValues>({
        criteriaMode: "all",
        defaultValues: FORM_DEFAULT_VALUES,
        mode: "all",
    });
    const [currentCommentsPage, setCurrentCommentsPage] =
        React.useState<number>(0);

    const { dirtyFields, isDirty, isValidating } = formState;

    const updateTitle = React.useCallback((updatedTitle: string) => {
        setCurrentTitle(updatedTitle);
    }, []);

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
                    element.innerHTML = sanitize(postContent);
                }
            },
        },
    );

    const mutateContent = React.useCallback(
        async (updatedContent: string): Promise<void> => {
            await mutate({ data: updatedContent } as ApiResponse<string>, {
                optimisticData: { data: updatedContent },
                revalidate: true,
            });
        },
        [mutate],
    );

    const onCommentEnterKey = React.useCallback(
        async (event: React.KeyboardEvent<HTMLDivElement>): Promise<void> => {
            const { key, shiftKey } = event;
            if (key === Key.Enter && shiftKey && dirtyFields.comment) {
                event.preventDefault();
                const { comment } = getValues();
                const addingCommentToast = toast.loading("Adding comment...");
                const { data: didAddComment } =
                    await new PostService().addComment(
                        comment,
                        postId as string,
                    );
                if (didAddComment) {
                    toast.update(addingCommentToast, {
                        autoClose: 1500,
                        isLoading: false,
                        render: "Successfully added comment!",
                        type: "success",
                    });
                    reset();
                } else {
                    toast.update(addingCommentToast, {
                        autoClose: 1500,
                        isLoading: false,
                        render: "Failed to add comment",
                        type: "error",
                    });
                }
            }
        },
        [dirtyFields.comment, getValues, postId, reset],
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
                <title>{currentTitle}</title>
            </Head>
            <div className={styles.post_content}>
                <div className={styles.post_title}>
                    {currentTitle}
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
                    dangerouslySetInnerHTML={{ __html: sanitize(postContent) }}
                    id="post_content_container"
                />
                <div className={styles.post_credits}>
                    {"Created by "}
                    <span className={styles.post_author_username}>
                        {authorUsername ?? "N/A"}
                    </span>
                    {` at ${new Date(_createdAt).toLocaleString()}`}
                </div>
                <InputGroup onKeyDown={onCommentEnterKey}>
                    <Form.Control
                        as="textarea"
                        className={styles.post_comment_input}
                        type="text"
                        {...register("comment")}
                    />
                    <OverlayTrigger
                        overlay={(
                            properties: OverlayInjectedProps,
                        ): JSX.Element =>
                            generateTooltip({
                                content: "Remove comment",
                                props: properties,
                            })
                        }
                        placement="bottom"
                    >
                        <Button variant="outline-secondary">
                            <i className="fa-solid fa-ban" />
                        </Button>
                    </OverlayTrigger>
                    <OverlayTrigger
                        overlay={(
                            properties: OverlayInjectedProps,
                        ): JSX.Element =>
                            generateTooltip({
                                content: "Submit comment",
                                props: properties,
                            })
                        }
                        placement="right"
                    >
                        <Button
                            disabled={
                                !isDirty || !dirtyFields.comment || isValidating
                            }
                            variant={
                                !isDirty && !dirtyFields.comment
                                    ? "outline-success"
                                    : "success"
                            }
                        >
                            <i className="fa-solid fa-check" />
                        </Button>
                    </OverlayTrigger>
                </InputGroup>
            </div>
            <EditPostModal
                content={postContent}
                mutateContent={mutateContent}
                onHideEditPostModal={toggleEditPost}
                postId={postId as string}
                showEditPostModal={editPost}
                title={title}
                updateTitle={updateTitle}
            />
        </>
    );
};
