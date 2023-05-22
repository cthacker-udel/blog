/* eslint-disable sonarjs/no-duplicate-string -- disabled */
/* eslint-disable no-extra-boolean-cast -- disabled */
/* eslint-disable @typescript-eslint/no-floating-promises -- disabled */
import { useRouter } from "next/router";
import React from "react";
import { Button, OverlayTrigger } from "react-bootstrap";
import type { OverlayInjectedProps } from "react-bootstrap/esm/Overlay";

import { UserService } from "@/api/service";
import { generateTooltip } from "@/common";
import { useBackground, useLayoutInjector } from "@/hooks";

import styles from "./Dashboard.module.css";

/**
 *
 * @returns
 */
export const Dashboard = (): JSX.Element => {
    useBackground({
        imageConfig: {
            background:
                "linear-gradient(0deg, rgba(34,162,195,1) 0%, rgba(45,66,253,1) 100%)",
        },
    });

    useLayoutInjector(styles.title_layout);

    const router = useRouter();

    const logout = React.useCallback(async () => {
        await new UserService().logout();
        router.push("/");
    }, [router]);

    return (
        <>
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
                        console.log("hello");
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
                    variant="info"
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
                    onClick={(): void => {
                        console.log("requesting admin access");
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
        </>
    );
};
