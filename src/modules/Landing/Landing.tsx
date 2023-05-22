/* eslint-disable camelcase -- disabled */
/* eslint-disable @typescript-eslint/no-floating-promises -- disabled */
import { useRouter } from "next/router";
import React from "react";
import { Button } from "react-bootstrap";

import { SimulateTyping } from "@/common";
import { useBackground, useCancelAnimations, useLayoutInjector } from "@/hooks";

import styles from "./Landing.module.css";

/**
 *
 * @returns
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
    const router = useRouter();

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
                <Button
                    onClick={(): void => {
                        router.push("/login");
                    }}
                    variant="outline-primary"
                >
                    {"Login"}
                </Button>
                <Button
                    onClick={(): void => {
                        router.push("/signup");
                    }}
                    variant="outline-secondary"
                >
                    {"Sign Up"}
                </Button>
            </div>
        </>
    );
};
