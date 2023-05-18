import React from "react";

import { useSimulateTyping } from "@/hooks";

import styles from "./SimulateTyping.module.css";

type SimulateTypingProperties = {
    className?: string;
    content: string;
};

/**
 *
 * @param param0
 * @returns
 */
export const SimulateTyping = ({
    className,
    content,
}: SimulateTypingProperties): JSX.Element => {
    const reference = React.createRef<HTMLDivElement>();
    useSimulateTyping({
        content,
        ref: reference,
    });

    return (
        <span
            className={`${className} ${styles.typing_container}`}
            ref={reference}
        />
    );
};
