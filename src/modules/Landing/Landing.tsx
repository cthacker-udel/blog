/* eslint-disable @typescript-eslint/no-floating-promises -- disabled */
import { useRouter } from "next/router";
import React from "react";
import { Button } from "react-bootstrap";

import { SimulateTyping } from "@/common";
import { useBackground, useLayoutInjector } from "@/hooks";

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
    const router = useRouter();

    return (
        <>
            <div className={styles.landing_container}>
                <SimulateTyping
                    className={styles.landing_title}
                    content="Cameron Thacker's Blog"
                />
            </div>
            <div className={styles.button_container}>
                <Button
                    onClick={(): void => {
                        router.push("/login");
                    }}
                    variant="outline-primary"
                >
                    {"Login"}
                </Button>
                <Button variant="outline-secondary">{"Sign Up"}</Button>
            </div>
        </>
    );
};
