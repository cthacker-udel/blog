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

import type { ApiResponse, CommentWithUsername } from "@/@types";
import { PostService } from "@/api/service/post";
import { generateTooltip, ReactionType } from "@/common";
import { Endpoints } from "@/constants";
import { useBackground } from "@/hooks";

import { EditPostModal } from "./EditPostModal";
import styles from "./Post.module.css";
import { PostComment } from "./PostComment";

type PostProperties = {
    authorUsername: string;
    createdAt: string;
    dislikes?: string[];
    isAuthor: boolean;
    likes?: string[];
    title: string;
    userId: string;
    username: string;
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
 * @param props - The properties of the Post component, which displays a post created in the blog
 * @param props.authorUsername - The username of the author of the post
 * @param props.createdAt - The time the post was created
 * @param props.dislikes - The # of dislikes the post has
 * @param props.isAuthor - Whether the current logged in user is the author of the post
 * @param props.likes - The # of likes the post has
 * @param props.title - The title of the post
 * @param props.userId - The id of the current logged in user
 * @param props.username - The username of the currently logged in user
 * @returns The current post being viewed
 */
export const Post = ({
    authorUsername,
    createdAt: _createdAt,
    dislikes,
    isAuthor,
    likes,
    title,
    userId: _userId,
}: PostProperties): JSX.Element => {
    const router = useRouter();
    const { postId } = router.query;
    useBackground({
        imageConfig: {
            background:
                "linear-gradient(0deg, rgba(34,162,195,1) 0%, rgba(253,121,45,1) 100%)",
        },
    });
    const { formState, getValues, register, reset } = useForm<FormValues>({
        criteriaMode: "all",
        defaultValues: FORM_DEFAULT_VALUES,
        mode: "all",
    });

    const { dirtyFields, isDirty, isValidating } = formState;

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

    const {
        data: allCommentsData,
        error: allCommentsError,
        isLoading: allCommentsLoading,
        mutate: mutateAllComments,
    } = useSWR<ApiResponse<CommentWithUsername[]>, Error, string>(
        `${Endpoints.POST.BASE}${Endpoints.POST.ALL_COMMENTS}?postId=${postId}`,
        null,
        { refreshInterval: 300_000, revalidateOnMount: true },
    );

    const [editPost, setEditPost] = React.useState<boolean>(false);
    const [currentTitle, setCurrentTitle] = React.useState<string>(title);
    const [userLikes, setUserLikes] = React.useState<string[]>(likes ?? []);
    const [userDislikes, setUserDislikes] = React.useState<string[]>(
        dislikes ?? [],
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

    const mutateComment = React.useCallback(
        async (
            index: number,
            reactionType: ReactionType,
            commentId: string,
            doesAlreadyLike: boolean,
            doesAlreadyDislike: boolean,
        ): Promise<void> => {
            setUserLikes((oldUserLikes: string[]) => {
                const doesLikeAlreadyExist = oldUserLikes.indexOf(commentId);

                if (
                    doesLikeAlreadyExist === -1 &&
                    reactionType === ReactionType.LIKE
                ) {
                    return [...oldUserLikes, commentId];
                }
                return [...oldUserLikes].filter(
                    (_, oldUserLikeIndex: number) =>
                        oldUserLikeIndex !== doesLikeAlreadyExist,
                );
            });

            setUserDislikes((oldUserDislikes: string[]) => {
                const doesDislikeAlreadyExist =
                    oldUserDislikes.indexOf(commentId);

                if (
                    doesDislikeAlreadyExist === -1 &&
                    reactionType === ReactionType.DISLIKE
                ) {
                    return [...oldUserDislikes, commentId];
                }
                return [...oldUserDislikes].filter(
                    (_, oldUserDislikeIndex: number) =>
                        oldUserDislikeIndex !== doesDislikeAlreadyExist,
                );
            });

            await mutateAllComments(
                (
                    currentData: ApiResponse<CommentWithUsername[]> | undefined,
                ) => {
                    if (currentData !== undefined) {
                        const { data: allCurrentComments } = currentData;

                        allCurrentComments[index].likes +=
                            reactionType === ReactionType.LIKE
                                ? doesAlreadyLike
                                    ? -1
                                    : 1
                                : 0;
                        allCurrentComments[index].dislikes +=
                            reactionType === ReactionType.DISLIKE
                                ? doesAlreadyDislike
                                    ? -1
                                    : 1
                                : 0;
                        currentData.data = allCurrentComments;
                        return currentData;
                    }

                    return currentData;
                },
            );
        },
        [mutateAllComments],
    );

    const addComment = React.useCallback(async (): Promise<void> => {
        const { comment } = getValues();
        const addingCommentToast = toast.loading("Adding comment...");
        const {
            data: [didAddComment, addedCommentId],
        } = await new PostService().addComment(comment, postId as string);
        if (didAddComment) {
            toast.update(addingCommentToast, {
                autoClose: 1500,
                isLoading: false,
                render: "Successfully added comment!",
                type: "success",
            });
            reset();
            mutateAllComments(
                (
                    currentData: ApiResponse<CommentWithUsername[]> | undefined,
                ) => ({
                    ...currentData,
                    data: [
                        ...(currentData === undefined ? [] : currentData.data),
                        {
                            _id: addedCommentId,
                            comment,
                            createdAt: new Date(Date.now()),
                            dislikes: 0,
                            likes: 0,
                            modifiedAt: new Date(Date.now()),
                        } as CommentWithUsername,
                    ],
                }),
                { revalidate: true },
            );
        } else {
            toast.update(addingCommentToast, {
                autoClose: 1500,
                isLoading: false,
                render: "Failed to add comment",
                type: "error",
            });
        }
    }, [getValues, mutateAllComments, postId, reset]);

    const onCommentEnterKey = React.useCallback(
        async (event: React.KeyboardEvent<HTMLDivElement>): Promise<void> => {
            const { key, shiftKey } = event;
            if (key === Key.Enter && shiftKey && dirtyFields.comment) {
                event.preventDefault();
                await addComment();
            }
        },
        [addComment, dirtyFields.comment],
    );

    const updateTitle = React.useCallback((updatedTitle: string) => {
        setCurrentTitle(updatedTitle);
    }, []);

    const toggleEditPost = React.useCallback(() => {
        setEditPost((oldValue: boolean) => !oldValue);
    }, []);

    if (
        postId === undefined ||
        isLoading ||
        data === undefined ||
        allCommentsData === undefined ||
        allCommentsLoading
    ) {
        return <div />;
    }

    const { data: postContent } = data;
    const { data: allComments } = allCommentsData;

    if (error || allCommentsError) {
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
                <div className={styles.post_comments}>
                    {allComments.map(
                        (
                            eachComment: CommentWithUsername,
                            eachCommentIndex: number,
                        ) => {
                            const doesDislike = userDislikes?.some(
                                (eachDislikeId: string) =>
                                    eachDislikeId ===
                                    eachComment._id?.toString().toLowerCase(),
                            );

                            const doesLike = userLikes?.some(
                                (eachLikeId: string) =>
                                    eachLikeId ===
                                    eachComment._id?.toString().toLowerCase(),
                            );

                            return (
                                <PostComment
                                    {...eachComment}
                                    doesDislike={doesDislike ?? false}
                                    doesLike={doesLike ?? false}
                                    index={eachCommentIndex}
                                    key={eachComment._id?.toString()}
                                    mutateComment={mutateComment}
                                />
                            );
                        },
                    )}
                </div>
                <InputGroup onKeyDown={onCommentEnterKey}>
                    <Form.Control
                        as="textarea"
                        className={styles.post_comment_input}
                        placeholder="Shift + Enter to add!"
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
                            onClick={async (): Promise<void> => {
                                await addComment();
                            }}
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
