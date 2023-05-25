/* eslint-disable sonarjs/no-duplicate-string -- disabled */
/* eslint-disable no-extra-boolean-cast -- disabled */
/* eslint-disable @typescript-eslint/no-floating-promises -- disabled */
import Head from "next/head";
import { useRouter } from "next/router";
import React from "react";
import { Button, OverlayTrigger } from "react-bootstrap";
import type { OverlayInjectedProps } from "react-bootstrap/esm/Overlay";
import { toast } from "react-toastify";

import { AdminService, UserService } from "@/api/service";
import { generateTooltip, UserRoles } from "@/common";
import {
    useBackground,
    useLayoutInjector,
    useNotifications,
    useSession,
} from "@/hooks";

import { AddPostModal } from "./AddPostModal";
import styles from "./Dashboard.module.css";
import { EditUsernameModal } from "./EditUsernameModal";
import { PostsOffCanvas } from "./PostsOffCanvas";
import { UserInfo } from "./UserInfo";

type DashboardProperties = {
    createdAt: string;
    role: UserRoles;
    username: string;
};

/**
 *
 * @returns
 */
export const Dashboard = ({
    createdAt,
    role,
    username,
}: DashboardProperties): JSX.Element => {
    useBackground({
        imageConfig: {
            background:
                "linear-gradient(0deg, rgba(34,162,195,1) 0%, rgba(45,66,253,1) 100%)",
        },
    });

    useLayoutInjector(styles.title_layout);
    useSession();
    useNotifications();

    const router = useRouter();

    const logout = React.useCallback(async () => {
        await new UserService().logout();
        router.push("/");
    }, [router]);

    const requestAdminAccess = React.useCallback(async () => {
        if (role === UserRoles.USER) {
            const requestingToast = toast.loading("Requesting admin access...");
            const { data, error } =
                await new AdminService().requestAdminAccess();

            if (data) {
                toast.update(requestingToast, {
                    autoClose: 1500,
                    isLoading: false,
                    render: "Successfully sent request!",
                    type: "success",
                });
            } else {
                toast.update(requestingToast, {
                    autoClose: 1500,
                    isLoading: false,
                    render: `${
                        error === undefined
                            ? "Failed to send request"
                            : error.message
                    }`,
                    type: "error",
                });
            }
        } else {
            toast.success("You already have admin permissions!");
        }
    }, [role]);

    const [showEditUsernameModal, setShowEditUsernameModal] =
        React.useState<boolean>(false);

    const closeEditUsernameModal = React.useCallback(() => {
        setShowEditUsernameModal(false);
    }, []);

    const [showAddPostModal, setShowAddPostModal] =
        React.useState<boolean>(false);

    const closeAddPostModal = React.useCallback(() => {
        setShowAddPostModal(false);
    }, []);

    const [showPostsOffCanvas, setShowPostsOffCanvas] =
        React.useState<boolean>(false);

    const closePostsOffCanvas = React.useCallback(() => {
        setShowPostsOffCanvas(false);
    }, []);

    return (
        <>
            <Head>
                <title>{"Dashboard"}</title>
            </Head>
            <div className={styles.title}>{"Posts"}</div>
            <OverlayTrigger
                overlay={(properties: OverlayInjectedProps): JSX.Element =>
                    generateTooltip({ content: "Log Out", props: properties })
                }
                placement="left"
            >
                <Button
                    className={styles.logout_button}
                    onClick={async (): Promise<void> => {
                        await logout();
                    }}
                    onMouseEnter={(
                        event: React.MouseEvent<HTMLButtonElement>,
                    ): void => {
                        const { target } = event;
                        if (target !== null) {
                            const convertedTarget = target as HTMLButtonElement;
                            convertedTarget.className =
                                convertedTarget.className.replaceAll(
                                    "btn-secondary",
                                    "btn-warning",
                                );
                            const icon = document.querySelector("#logout_icon");
                            if (Boolean(icon) && icon !== null) {
                                const convertedIcon = icon as HTMLElement;
                                convertedIcon.className = `${convertedIcon.className} fa-fade`;
                            }
                        }
                    }}
                    onMouseLeave={(
                        event: React.MouseEvent<HTMLButtonElement>,
                    ): void => {
                        const { target } = event;
                        if (target !== null) {
                            const convertedTarget = target as HTMLButtonElement;
                            convertedTarget.className =
                                convertedTarget.className.replaceAll(
                                    "btn-warning",
                                    "btn-secondary",
                                );
                            const icon = document.querySelector("#logout_icon");
                            if (Boolean(icon) && icon !== null) {
                                const convertedIcon = icon as HTMLElement;
                                convertedIcon.className =
                                    convertedIcon.className.replaceAll(
                                        " fa-fade",
                                        "",
                                    );
                            }
                        }
                    }}
                    variant="secondary"
                >
                    <i className="fa-solid fa-share" id="logout_icon" />
                </Button>
            </OverlayTrigger>
            <OverlayTrigger
                overlay={(properties: OverlayInjectedProps): JSX.Element =>
                    generateTooltip({
                        content: "Edit Username",
                        props: properties,
                    })
                }
                placement="left"
            >
                <Button
                    className={styles.change_username_button}
                    onClick={(): void => {
                        setShowEditUsernameModal(true);
                    }}
                    onMouseEnter={(
                        event: React.MouseEvent<HTMLButtonElement>,
                    ): void => {
                        const { target } = event;
                        if (Boolean(target)) {
                            const convertedTarget = target as HTMLButtonElement;
                            convertedTarget.className =
                                convertedTarget.className.replace(
                                    "btn-info",
                                    "btn-primary",
                                );
                            const icon = document.querySelector(
                                "#edit_username_icon",
                            );
                            if (Boolean(icon) && icon !== null) {
                                icon.className = `${icon.className} fa-beat`;
                            }
                        }
                    }}
                    onMouseLeave={(
                        event: React.MouseEvent<HTMLButtonElement>,
                    ): void => {
                        const { target } = event;
                        if (Boolean(target)) {
                            const convertedTarget = target as HTMLButtonElement;
                            convertedTarget.className =
                                convertedTarget.className.replace(
                                    "btn-primary",
                                    "btn-info",
                                );
                            const icon = document.querySelector(
                                "#edit_username_icon",
                            );
                            if (Boolean(icon) && icon !== null) {
                                icon.className = icon.className.replaceAll(
                                    " fa-beat",
                                    "",
                                );
                            }
                        }
                    }}
                    variant="danger"
                >
                    <i
                        className="fa-solid fa-user-pen"
                        id="edit_username_icon"
                    />
                </Button>
            </OverlayTrigger>
            <OverlayTrigger
                overlay={(properties: OverlayInjectedProps): JSX.Element =>
                    generateTooltip({
                        content: "Request Admin Access",
                        props: properties,
                    })
                }
                placement="left"
            >
                <Button
                    className={styles.request_admin_access_button}
                    onClick={async (): Promise<void> => {
                        await requestAdminAccess();
                    }}
                    onMouseEnter={(
                        event: React.MouseEvent<HTMLButtonElement>,
                    ): void => {
                        const { target } = event;
                        if (Boolean(target)) {
                            const convertedTarget = target as HTMLButtonElement;
                            convertedTarget.className =
                                convertedTarget.className.replace(
                                    "btn-primary",
                                    "btn-info",
                                );
                            const icon = document.querySelector(
                                "#request_admin_access_icon",
                            );
                            if (Boolean(icon) && icon !== null) {
                                icon.className = `${icon.className} fa-flip`;
                            }
                        }
                    }}
                    onMouseLeave={(
                        event: React.MouseEvent<HTMLButtonElement>,
                    ): void => {
                        const { target } = event;
                        if (Boolean(target)) {
                            const convertedTarget = target as HTMLButtonElement;
                            convertedTarget.className =
                                convertedTarget.className.replace(
                                    "btn-primary",
                                    "btn-info",
                                );
                            const icon = document.querySelector(
                                "#request_admin_access_icon",
                            );
                            if (Boolean(icon) && icon !== null) {
                                icon.className = icon.className.replaceAll(
                                    " fa-flip",
                                    "",
                                );
                            }
                        }
                    }}
                    variant="warning"
                >
                    <i
                        className="fa-solid fa-unlock"
                        id="request_admin_access_icon"
                    />
                </Button>
            </OverlayTrigger>
            <OverlayTrigger
                overlay={(properties: OverlayInjectedProps): JSX.Element =>
                    generateTooltip({
                        content: (
                            <UserInfo
                                createdAt={createdAt}
                                role={role}
                                username={username}
                            />
                        ),
                        props: properties,
                    })
                }
                placement="left"
            >
                <Button
                    className={styles.user_info_button}
                    onMouseEnter={(
                        event: React.MouseEvent<HTMLButtonElement>,
                    ): void => {
                        const { target } = event;
                        if (Boolean(target)) {
                            const convertedTarget = target as HTMLButtonElement;
                            convertedTarget.className =
                                convertedTarget.className.replace(
                                    "btn-primary",
                                    "btn-info",
                                );
                            const icon =
                                document.querySelector("#user_info_icon");
                            if (Boolean(icon) && icon !== null) {
                                icon.className = `${icon.className} fa-spin`;
                            }
                        }
                    }}
                    onMouseLeave={(
                        event: React.MouseEvent<HTMLButtonElement>,
                    ): void => {
                        const { target } = event;
                        if (Boolean(target)) {
                            const convertedTarget = target as HTMLButtonElement;
                            convertedTarget.className =
                                convertedTarget.className.replace(
                                    "btn-primary",
                                    "btn-info",
                                );
                            const icon =
                                document.querySelector("#user_info_icon");
                            if (Boolean(icon) && icon !== null) {
                                icon.className = icon.className.replaceAll(
                                    " fa-spin",
                                    "",
                                );
                            }
                        }
                    }}
                    variant="info"
                >
                    <i className="fa-solid fa-info" id="user_info_icon" />
                </Button>
            </OverlayTrigger>
            {role === UserRoles.ADMIN && (
                <OverlayTrigger
                    overlay={(properties: OverlayInjectedProps): JSX.Element =>
                        generateTooltip({
                            content: "Add Post",
                            props: properties,
                        })
                    }
                    placement="left"
                >
                    <Button
                        className={styles.add_post_button}
                        onClick={(): void => {
                            setShowAddPostModal(true);
                        }}
                        onMouseEnter={(
                            event: React.MouseEvent<HTMLButtonElement>,
                        ): void => {
                            const { target } = event;
                            if (Boolean(target)) {
                                const convertedTarget =
                                    target as HTMLButtonElement;
                                convertedTarget.className =
                                    convertedTarget.className.replace(
                                        "btn-dark",
                                        "btn-light",
                                    );
                                const icon =
                                    document.querySelector("#add_post_icon");
                                if (Boolean(icon) && icon !== null) {
                                    icon.className = `${icon.className} fa-shake`;
                                }
                            }
                        }}
                        onMouseLeave={(
                            event: React.MouseEvent<HTMLButtonElement>,
                        ): void => {
                            const { target } = event;
                            if (Boolean(target)) {
                                const convertedTarget =
                                    target as HTMLButtonElement;
                                convertedTarget.className =
                                    convertedTarget.className.replace(
                                        "btn-light",
                                        "btn-dark",
                                    );
                                const icon =
                                    document.querySelector("#add_post_icon");
                                if (Boolean(icon) && icon !== null) {
                                    icon.className = icon.className.replaceAll(
                                        " fa-shake",
                                        "",
                                    );
                                }
                            }
                        }}
                        variant="dark"
                    >
                        <i className="fa-solid fa-plus" id="add_post_icon" />
                    </Button>
                </OverlayTrigger>
            )}
            <OverlayTrigger
                overlay={(properties: OverlayInjectedProps): JSX.Element =>
                    generateTooltip({
                        content: "View Posts",
                        props: properties,
                    })
                }
                placement="left"
            >
                <Button
                    className={styles.view_posts_button}
                    onClick={(): void => {
                        setShowPostsOffCanvas(true);
                    }}
                    onMouseEnter={(
                        event: React.MouseEvent<HTMLButtonElement>,
                    ): void => {
                        const { target } = event;
                        if (Boolean(target)) {
                            const convertedTarget = target as HTMLButtonElement;
                            convertedTarget.className =
                                convertedTarget.className.replace(
                                    "btn-primary",
                                    "btn-info",
                                );
                            const icon =
                                document.querySelector("#view_posts_icon");
                            if (Boolean(icon) && icon !== null) {
                                icon.className = `${icon.className} fa-bounce`;
                            }
                        }
                    }}
                    onMouseLeave={(
                        event: React.MouseEvent<HTMLButtonElement>,
                    ): void => {
                        const { target } = event;
                        if (Boolean(target)) {
                            const convertedTarget = target as HTMLButtonElement;
                            convertedTarget.className =
                                convertedTarget.className.replace(
                                    "btn-primary",
                                    "btn-info",
                                );
                            const icon =
                                document.querySelector("#view_posts_icon");
                            if (Boolean(icon) && icon !== null) {
                                icon.className = icon.className.replaceAll(
                                    " fa-bounce",
                                    "",
                                );
                            }
                        }
                    }}
                    variant="success"
                >
                    <i className="fa-solid fa-eye" id="view_posts_icon" />
                </Button>
            </OverlayTrigger>
            <EditUsernameModal
                onHide={closeEditUsernameModal}
                showEditUsernameModal={showEditUsernameModal}
            />
            <AddPostModal
                onHide={closeAddPostModal}
                showAddPostModal={showAddPostModal}
            />
            <PostsOffCanvas
                onHidePostsOffCanvas={closePostsOffCanvas}
                showPostsOffCanvas={showPostsOffCanvas}
            />
        </>
    );
};
