/* eslint-disable @typescript-eslint/indent -- disabled */
import Head from "next/head";
import { useRouter } from "next/navigation";
import React from "react";
import { GridLoader } from "react-spinners";
import { toast } from "react-toastify";
import useSWR from "swr";

import type { ApiResponse, MostRecentPost } from "@/@types";
import { AdminService, UserService } from "@/api/service";
import { UserRoles } from "@/common";
import { Endpoints } from "@/constants";
import {
    useBackground,
    useLayoutInjector,
    useNotifications,
    useSession,
} from "@/hooks";

import { AddPostModal } from "./AddPostModal";
import styles from "./Dashboard.module.css";
import { DashboardOption } from "./DashboardOption";
import { DashboardPost } from "./DashboardPost";
import { EditUsernameModal } from "./EditUsernameModal";
import { PostsOffCanvas } from "./PostsOffCanvas";
import { UserInfo } from "./UserInfo";

type DashboardProperties = {
    createdAt: string;
    role: UserRoles;
    username: string;
};

/**
 * The dashboard represents visualizing and displaying all the options the user has within the application.
 *
 * @returns The dashboard component, containing all the options/data the user can interact/observe
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

    const { data: mostRecentPosts, isLoading: isMostRecentPostsLoading } =
        useSWR<ApiResponse<MostRecentPost[]>, Error, string>(
            `${Endpoints.POST.BASE}${Endpoints.POST.MOST_RECENT}`,
        );

    const router = useRouter();

    const logout = React.useCallback(async () => {
        const loggingOutToast = toast.loading("Logging out...");
        const { data: loggedOutSuccessfully } =
            await new UserService().logout();
        if (loggedOutSuccessfully) {
            toast.update(loggingOutToast, {
                autoClose: 1500,
                isLoading: false,
                render: "Logged out successfully!",
                type: "success",
            });
        } else {
            toast.update(loggingOutToast, {
                autoClose: 1500,
                isLoading: false,
                render: "Failed to log out",
                type: "error",
            });
        }
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

    const keyboardShortcuts = React.useCallback(
        async (event: KeyboardEvent) => {
            const { ctrlKey, key, shiftKey } = event;
            if (shiftKey && ctrlKey) {
                if (key.toLocaleLowerCase() === "p") {
                    setShowAddPostModal((oldValue: boolean) => !oldValue);
                } else if (key.toLocaleLowerCase() === "e") {
                    setShowEditUsernameModal((oldValue: boolean) => !oldValue);
                } else if (key.toLocaleLowerCase() === "l") {
                    await logout();
                } else if (key.toLocaleLowerCase() === "v") {
                    setShowPostsOffCanvas((oldValue: boolean) => !oldValue);
                } else if (key.toLocaleLowerCase() === "r") {
                    await requestAdminAccess();
                }
            }
        },
        [logout, requestAdminAccess],
    );

    React.useEffect(() => {
        document.addEventListener("keydown", keyboardShortcuts);

        return () => {
            document.removeEventListener("keydown", keyboardShortcuts);
        };
    }, [keyboardShortcuts]);

    return (
        <>
            <Head>
                <title>{"Dashboard"}</title>
            </Head>
            <div className={styles.each_post_container}>
                {isMostRecentPostsLoading ? (
                    <div className={styles.loading_posts_container}>
                        <div className={styles.loading_posts_title}>
                            {"Loading Posts"}
                        </div>
                        <GridLoader color="blue" size={30} />
                    </div>
                ) : mostRecentPosts?.data.length !== undefined &&
                  mostRecentPosts.data.length > 0 ? (
                    mostRecentPosts?.data.map((eachPost: MostRecentPost) => (
                        <DashboardPost
                            key={eachPost._id?.toString() ?? ""}
                            {...eachPost}
                        />
                    ))
                ) : (
                    <div className={styles.no_posts_display}>
                        {"Post something!"}
                    </div>
                )}
            </div>
            <DashboardOption
                buttonEndingGradient="btn-warning"
                buttonFAAnimation="fa-fade"
                buttonIconClassName="fa-solid fa-share"
                buttonIconId="logout_icon"
                buttonStartingGradient="btn-secondary"
                buttonVariant="secondary"
                customButtonStyle={styles.logout_button}
                onClick={async (): Promise<void> => {
                    await logout();
                }}
                overlayTriggerTooltipContent={"Log Out"}
            />
            <DashboardOption
                buttonEndingGradient="btn-primary"
                buttonFAAnimation="fa-beat"
                buttonIconClassName="fa-solid fa-user-pen"
                buttonIconId="edit_username_icon"
                buttonStartingGradient="btn-info"
                buttonVariant="danger"
                customButtonStyle={styles.change_username_button}
                onClick={setShowEditUsernameModal}
                overlayTriggerTooltipContent={"Edit Username"}
            />
            <DashboardOption
                buttonEndingGradient="btn-info"
                buttonFAAnimation="fa-flip"
                buttonIconClassName="fa-solid fa-unlock"
                buttonIconId="request_admin_access_icon"
                buttonStartingGradient="btn-info"
                buttonVariant="warning"
                customButtonStyle={styles.request_admin_access_button}
                onClick={async (): Promise<void> => {
                    await requestAdminAccess();
                }}
                overlayTriggerTooltipContent={"Request Admin Access"}
            />
            <DashboardOption
                buttonEndingGradient="btn-primary"
                buttonFAAnimation="fa-spin"
                buttonIconClassName="fa-solid fa-info"
                buttonIconId="user_info_icon"
                buttonStartingGradient="btn-info"
                customButtonStyle={styles.user_info_button}
                overlayTriggerTooltipContent={
                    <UserInfo
                        createdAt={createdAt}
                        role={role}
                        username={username}
                    />
                }
            />
            {role === UserRoles.ADMIN && (
                <DashboardOption
                    buttonEndingGradient="btn-light"
                    buttonFAAnimation="fa-shake"
                    buttonIconClassName="fa-solid fa-plus"
                    buttonIconId="add_post_icon"
                    buttonStartingGradient="btn-dark"
                    buttonVariant="dark"
                    customButtonStyle={styles.add_post_button}
                    onClick={setShowAddPostModal}
                    overlayTriggerTooltipContent="Add Post"
                />
            )}
            <DashboardOption
                buttonEndingGradient="btn-primary"
                buttonFAAnimation="fa-bounce"
                buttonIconClassName="fa-solid fa-eye"
                buttonIconId="view_posts_icon"
                buttonStartingGradient="fa-info"
                buttonVariant="success"
                customButtonStyle={styles.view_posts_button}
                onClick={setShowPostsOffCanvas}
                overlayTriggerTooltipContent="View Posts"
            />
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
