import React from "react";

import { useBackground, useSimulateTyping } from "@/hooks";

import styles from "./Landing.module.css";

/**
 *
 * @returns
 */
export const Landing = (): JSX.Element => {
    const blogTitleReference = React.createRef<HTMLDivElement>();
    useBackground({
        imageConfig: {
            background:
                "linear-gradient(0deg, rgba(34,193,195,1) 0%, rgba(253,187,45,1) 100%)",
        },
    });
    useSimulateTyping({
        content: "Cameron Thacker's Blog",
        ref: blogTitleReference,
    });

    return (
        <div className={styles.landing_container}>
            <div className={styles.landing_title} ref={blogTitleReference} />
        </div>
    );
};
