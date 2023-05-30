import React from "react";

import type { Post } from "@/@types";

import styles from "./DashboardPost.module.css";

type DashboardPostProperties = Post;

/**
 * The dashboard post component, which receives a post and displays it to the user
 *
 * @param props - The properties of the dashboard post component, @see {@link Post}
 */
export const DashboardPost = ({
    _id,
    author,
    createdAt,
    content,
    modifiedAt,
    textContent,
    title,
}: DashboardPostProperties): JSX.Element => (
    <div className={styles.each_post}>{title}</div>
);
