import React from "react";
import { Tooltip } from "react-bootstrap";
import type { OverlayInjectedProps } from "react-bootstrap/esm/Overlay";

type GenerateTooltipArgument = {
    props: OverlayInjectedProps;
    text: string;
};

/**
 * Generates a tooltip as an overlay to the OverlayTrigger component
 *
 * @param arguments - The arguments passed into the function, come in as an object to avoid multiple parameters
 * @param arguments.props - The injected properties sent by the OverlayTrigger component
 * @param arguments.text - The text to display in the tooltip
 * @returns The generated tooltip with OverlayTrigger props injected
 */
export const generateTooltip = ({
    props,
    text,
}: GenerateTooltipArgument): JSX.Element => (
    <Tooltip id={`tooltip_${text}`} {...props}>
        {text}
    </Tooltip>
);
