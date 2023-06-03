/* eslint-disable camelcase -- disabled */
import Link from "next/link";
import React from "react";
import { Button } from "react-bootstrap";

import { SimulateTyping } from "@/common";
import { useBackground, useCancelAnimations, useLayoutInjector } from "@/hooks";

import styles from "./Landing.module.css";

/**
 * The base page the user lands on when first entering the web application
 *
 * @returns The landing page
 */
export const Landing = (): JSX.Element => {
    useBackground({
        imageConfig: {
            background:
                "linear-gradient(0deg, rgba(34,193,195,1) 0%, rgba(253,187,45,1) 100%)",
        },
    });
    useLayoutInjector(styles.landing_body);
    useCancelAnimations({
        endingAnimationIdMapping: {
            landing_button_container: { opacity: "100%", top: "75vh" },
        },
        ids: ["landing_button_container"],
    });

    return (
        <>
            <div className={styles.landing_container}>
                <SimulateTyping
                    className={styles.landing_title}
                    content="Cameron Thacker's Blog"
                />
            </div>
            <div
                className={styles.button_container}
                id="landing_button_container"
            >
                <Link href="/login">
                    <Button variant="outline-primary">{"Login"}</Button>
                </Link>
                <Link href="/signup">
                    <Button variant="outline-secondary">{"Sign Up"}</Button>
                </Link>
            </div>
        </>
    );
};
