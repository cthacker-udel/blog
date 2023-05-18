import React from "react";

import { SimulateTyping } from "@/common";
import { useBackground } from "@/hooks";

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

    return (
        <div className={styles.landing_container}>
            <SimulateTyping
                className={styles.landing_title}
                content="Cameron Thacker's Blog"
            />
        </div>
    );
};
