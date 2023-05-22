import React from "react";
import { Button, OverlayTrigger } from "react-bootstrap";
import type { OverlayInjectedProps } from "react-bootstrap/esm/Overlay";

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

    return (
        <>
            <div className={styles.title}>{"Posts"}</div>
            <OverlayTrigger
                overlay={(properties: OverlayInjectedProps): JSX.Element =>
                    generateTooltip({ content: "Log Out", props: properties })
                }
                placement="left"
            >
                <Button className={styles.logout_button} variant="secondary">
                    <i className="fa-solid fa-share" />
                </Button>
            </OverlayTrigger>
        </>
    );
};
