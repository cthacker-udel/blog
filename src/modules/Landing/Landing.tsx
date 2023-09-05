/* eslint-disable @typescript-eslint/no-floating-promises -- disabled */
/* eslint-disable camelcase -- disabled */
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { Alert, Button } from "react-bootstrap";
import { Key } from "ts-key-enum";

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
    const router = useRouter();

    const keyboardShortcuts = React.useCallback(
        (event: KeyboardEvent) => {
            const { ctrlKey, key, shiftKey } = event;
            if (shiftKey && ctrlKey) {
                if (key === Key.ArrowRight) {
                    router.push("/login");
                } else if (key === Key.ArrowLeft) {
                    router.push("/signup");
                }
            }
        },
        [router],
    );

    React.useEffect(() => {
        router.prefetch("/login");
        router.prefetch("/signup");
        document.addEventListener("keydown", keyboardShortcuts);

        return () => {
            document.removeEventListener("keydown", keyboardShortcuts);
        };
    }, [keyboardShortcuts, router]);

    return (
        <>
            <div className={styles.landing_container_skip_notif}>
                <Alert
                    className={`opacity-50 ${styles.landing_container_skip_notif_alert}`}
                    variant="secondary"
                >
                    {"Press Enter to skip animation"}
                </Alert>
            </div>
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
