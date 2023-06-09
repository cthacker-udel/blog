/* eslint-disable @typescript-eslint/no-floating-promises -- disabled */

import { useRouter } from "next/router";
import React from "react";
import { Offcanvas } from "react-bootstrap";
import DotLoader from "react-spinners/DotLoader";

import type { Post } from "@/@types";
import { UserService } from "@/api/service";

import styles from "./PostsOffcanvas.module.css";

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
    const [posts, setPosts] = React.useState<Post[]>([]);
    const [isLoadingPosts, setIsLoadingPosts] = React.useState<boolean>(true);
    const [isPending, startTransition] = React.useTransition();

    const fetchPosts = React.useCallback((): void => {
        startTransition(async () => {
            const { data } = await new UserService().authoredPosts();
            setPosts(data);
            setIsLoadingPosts(false);
        });
    }, []);

    React.useEffect(() => {
        if (showPostsOffCanvas) {
            fetchPosts();
        }
    }, [fetchPosts, showPostsOffCanvas]);

    const router = useRouter();

    return (
        <Offcanvas
            className={styles.posts_offcanvas_content}
            onHide={onHidePostsOffCanvas}
            placement="start"
            show={showPostsOffCanvas}
        >
            <Offcanvas.Header className={styles.posts_offcanvas_header}>
                {"Posts"}
                <i className="fa-solid fa-signs-post fa-md" />
            </Offcanvas.Header>
            <hr />
            <Offcanvas.Body className={styles.posts_offcanvas_body}>
                {isLoadingPosts || isPending ? (
                    <div className={styles.loading_posts_container}>
                        <div className={styles.loading_posts_title}>
                            {"Loading"}
                        </div>
                        <DotLoader color="yellow" />
                    </div>
                ) : posts.length > 0 ? (
                    posts.map((eachPost: Post) => (
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
                    ))
                ) : (
                    <div className={styles.no_posts_section}>
                        {"No Posts Available, start posting!"}
                    </div>
                )}
            </Offcanvas.Body>
        </Offcanvas>
    );
};
