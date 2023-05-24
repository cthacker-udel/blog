/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/indent -- disabled */

import { ApiResponse, Post } from "@/@types";
import { Endpoints } from "@/constants";
import React from "react";
import { Offcanvas } from "react-bootstrap";
import useSWR from "swr";
import styles from "./PostsOffcanvas.module.css";
import { useRouter } from "next/router";

type PostsOffCanvasProperties = {
    onHidePostsOffCanvas: () => void;
    showPostsOffCanvas: boolean;
};

/**
 * Displays all the posts the user has created on the screen, in a sidebar.
 *
 * @param props - The properties of the posts offcanvas, which house all of the posts the user has made
 * @param props.onHidePostsOffCanvas - The callback that is fired when the offcanvas is closed
 * @param props.showPostsOffCanvas - The boolean that controls whether the posts off canvas is showing or not
 * @returns The OffCanvas filled with all the posts the user has created
 */
export const PostsOffCanvas = ({
    onHidePostsOffCanvas,
    showPostsOffCanvas,
}: PostsOffCanvasProperties): JSX.Element => {
    const { data, error, isLoading } = useSWR<
        ApiResponse<Post[]>,
        Error,
        string
    >(`${Endpoints.POST.BASE}${Endpoints.POST.ALL_AUTHORED}`);

    const router = useRouter();

    if (isLoading || data === undefined) {
        return <div />;
    }

    if (error) {
        router.push("/");
    }

    const { data: posts } = data;

    return (
        <Offcanvas
            className={styles.posts_offcanvas_content}
            onHide={onHidePostsOffCanvas}
            placement="start"
            show={showPostsOffCanvas}
        >
            <Offcanvas.Header className={styles.posts_offcanvas_header}>
                {"Posts"}
            </Offcanvas.Header>
            <hr />
            <Offcanvas.Body>
                {posts.map((eachPost: Post) => (
                    <div
                        className={styles.posts_post_listing}
                        key={eachPost.title}
                    >
                        <div
                            className={styles.posts_post_title}
                            onClick={(): void => {
                                router.push(`post/${eachPost._id}`);
                            }}
                        >
                            {eachPost.title}
                        </div>
                        <div className={styles.posts_post_dates}>
                            <div className={styles.posts_post_date}>
                                {`Created ${new Date(
                                    eachPost.createdAt,
                                ).toLocaleString()}`}
                            </div>
                            {eachPost.createdAt !== eachPost.modifiedAt && (
                                <div className={styles.posts_post_date}>
                                    {`Updated ${new Date(
                                        eachPost.modifiedAt,
                                    ).toLocaleString()}`}
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </Offcanvas.Body>
        </Offcanvas>
    );
};
