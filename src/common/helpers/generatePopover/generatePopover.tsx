import React, { type ReactNode } from "react";
import { Popover } from "react-bootstrap";
import type { OverlayInjectedProps } from "react-bootstrap/esm/Overlay";

type PopoverClassNameOverrides = {
    popoverClassNameOverride?: string;
    popoverHeaderClassNameOverride?: string;
    popoverBodyClassNameOverride?: string;
};

/**
 * Generates a popover element for the OverlayTrigger to render
 *
 * @param properties - The injected properties from the OverlayTrigger component
 * @param bodyContent - The content of the popover's body, can range from a string to react element
 * @param headerContent - The content of the popover's header, can range from a string to react element
 * @param popoverClassNameOverride - The className that will override the base popover element
 * @param popoverHeaderClassNameOverride - The className that will override the header component of the popover element
 * @param popoverBodyClassNameOverride - The className that will override the body component of the popover element
 * @returns The generated popover element
 */
export const generatePopover = (
    properties: OverlayInjectedProps,
    bodyContent: ReactNode | string,
    headerContent: ReactNode | string,
    classNameOverrides?: PopoverClassNameOverrides,
): JSX.Element => (
    <Popover
        {...properties}
        className={classNameOverrides?.popoverClassNameOverride ?? ""}
    >
        <Popover.Header
            className={classNameOverrides?.popoverHeaderClassNameOverride ?? ""}
        >
            {headerContent}
        </Popover.Header>
        <Popover.Body
            className={classNameOverrides?.popoverBodyClassNameOverride ?? ""}
        >
            {bodyContent ?? <div />}
        </Popover.Body>
    </Popover>
);
