import React from "react";

import { useNotifications } from "@/hooks";

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
    useNotifications();
    return (
        <div
            className={`${styles.container} ${containerOverride ?? ""}`.trim()}
            id="layout"
        >
            {children}
        </div>
    );
};
