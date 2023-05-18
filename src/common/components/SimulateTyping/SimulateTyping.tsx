import React from "react";

import { useSimulateTyping } from "@/hooks";

import styles from "./SimulateTyping.module.css";

type SimulateTypingProperties = {
    className?: string;
    content: string;
};

/**
 * Renders a live typing simulation
 *
 * @param props - The properties of the SimulateTyping component
 * @param props.className - The className that is injected into this component to apply to the text being injected
 * @param props.content - The content the component is rendering
 * @returns The animated text being displayed
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
