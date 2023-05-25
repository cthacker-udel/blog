import React from "react";
import { toast, type ToastItem } from "react-toastify";

import styles from "./Layout.module.css";

type LayoutProperties = {
    containerOverride?: string;
};

/**
 * Layout component, which takes in a child as a property, as well as props to override the css class names that are
 * applied to this component
 *
 * @returns - The common layout component used throughout the application
 */
export const Layout = ({
    children,
    containerOverride,
}: React.PropsWithChildren<LayoutProperties>): JSX.Element => {
    React.useEffect(() => {
        const unsubscribe = toast.onChange(async (payload: ToastItem) => {
            const { status, type } = payload;
            if (status === "added" || status === "updated") {
                const audioElement = document.querySelector(
                    `#notification_${type}`,
                );
                if (audioElement !== null) {
                    const convertedElement = audioElement as HTMLAudioElement;
                    const newAudioElement = document.createElement("audio");
                    newAudioElement.src = convertedElement.src;
                    await newAudioElement.play();
                }
            } else if (status === "removed") {
                const audioElement = document.querySelector(
                    "#notification_removed",
                );
                if (audioElement !== null) {
                    const convertedElement = audioElement as HTMLAudioElement;
                    const newAudioElement = document.createElement("audio");
                    newAudioElement.src = convertedElement.src;
                    await newAudioElement.play();
                }
            }
        });

        return () => {
            unsubscribe();
        };
    }, []);

    return (
        <div
            className={`${styles.container} ${containerOverride ?? ""}`.trim()}
            id="layout"
        >
            {children}
        </div>
    );
};
