import React from "react";
import { OverlayTrigger } from "react-bootstrap";
import type { OverlayInjectedProps } from "react-bootstrap/esm/Overlay";

import type { Post } from "@/@types";
import { generateTooltip } from "@/common";

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
    content: _content,
    modifiedAt,
    textContent,
    title,
}: DashboardPostProperties): JSX.Element => (
    <div className={styles.each_post}>
        <div className={styles.each_post_headline}>
            <div className={styles.each_post_title}>{title}</div>
            <div className={styles.each_post_description}>{textContent}</div>
        </div>
        <div className={styles.each_post_information}>
            <div className={styles.each_post_singular_info}>
                <OverlayTrigger
                    overlay={(properties: OverlayInjectedProps): JSX.Element =>
                        generateTooltip({
                            content: "Author",
                            props: properties,
                        })
                    }
                    placement="left"
                >
                    <i className="fa-solid fa-user" />
                </OverlayTrigger>
                <span>{author.toString()}</span>
            </div>
            <div className={styles.each_post_singular_info}>
                <OverlayTrigger
                    overlay={(properties: OverlayInjectedProps): JSX.Element =>
                        generateTooltip({
                            content: "Created",
                            props: properties,
                        })
                    }
                    placement="left"
                >
                    <i className="fa-solid fa-calendar-plus" />
                </OverlayTrigger>
                <span>{new Date(createdAt).toLocaleString()}</span>
            </div>
            <div className={styles.each_post_singular_info}>
                <OverlayTrigger
                    overlay={(properties: OverlayInjectedProps): JSX.Element =>
                        generateTooltip({
                            content: "Modified",
                            props: properties,
                        })
                    }
                    placement="left"
                >
                    <i className="fa-solid fa-user-pen" />
                </OverlayTrigger>
                <span>{new Date(modifiedAt).toLocaleString()}</span>
            </div>
        </div>
    </div>
);
