/* eslint-disable no-extra-boolean-cast -- disabled */
import React, { type ReactNode } from "react";
import { Button, OverlayTrigger } from "react-bootstrap";
import type { OverlayInjectedProps } from "react-bootstrap/esm/Overlay";
import type { Placement } from "react-bootstrap/esm/types";

import { generateTooltip } from "@/common";

type DashboardOptionProperties = {
    buttonEndingGradient: string;
    buttonFAAnimation: string;
    buttonIconClassName: string;
    buttonIconId: string;
    buttonStartingGradient: string;
    buttonVariant?: string;
    customButtonStyle?: string;
    onClick?: ((_op: boolean) => void) | (() => Promise<void>) | (() => void);
    overlayTriggerTooltipContent: ReactNode | string;
    tooltipPlacement?: Placement;
};

/**
 *
 * @returns
 */
export const DashboardOption = ({
    buttonEndingGradient,
    buttonFAAnimation,
    buttonIconClassName,
    buttonIconId,
    buttonStartingGradient,
    buttonVariant,
    customButtonStyle,
    onClick,
    overlayTriggerTooltipContent,
    tooltipPlacement = "left",
}: DashboardOptionProperties): JSX.Element => (
    <OverlayTrigger
        overlay={(properties: OverlayInjectedProps): JSX.Element =>
            generateTooltip({
                content: overlayTriggerTooltipContent,
                props: properties,
            })
        }
        placement={tooltipPlacement}
    >
        <Button
            className={customButtonStyle ?? ""}
            onClick={async (): Promise<void> => {
                await onClick?.(true);
            }}
            onMouseEnter={(
                event: React.MouseEvent<HTMLButtonElement>,
            ): void => {
                const { target } = event;
                if (Boolean(target)) {
                    const convertedTarget = target as HTMLButtonElement;
                    convertedTarget.className =
                        convertedTarget.className.replace(
                            buttonStartingGradient,
                            buttonEndingGradient,
                        );
                    const icon = document.querySelector(`#${buttonIconId}`);
                    if (Boolean(icon) && icon !== null) {
                        icon.className = `${icon.className} ${buttonFAAnimation}`;
                    }
                }
            }}
            onMouseLeave={(
                event: React.MouseEvent<HTMLButtonElement>,
            ): void => {
                const { target } = event;
                if (Boolean(target)) {
                    const convertedTarget = target as HTMLButtonElement;
                    convertedTarget.className =
                        convertedTarget.className.replace(
                            buttonEndingGradient,
                            buttonStartingGradient,
                        );
                    const icon = document.querySelector(`#${buttonIconId}`);
                    if (Boolean(icon) && icon !== null) {
                        icon.className = icon.className.replaceAll(
                            ` ${buttonFAAnimation}`,
                            "",
                        );
                    }
                }
            }}
            variant={buttonVariant ?? ""}
        >
            <i className={buttonIconClassName} id={buttonIconId} />
        </Button>
    </OverlayTrigger>
);
