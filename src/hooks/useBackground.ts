/* eslint-disable @typescript-eslint/indent -- disabled */
import type { StaticImageData } from "next/image";
import React from "react";

type useBackgroundImageConfig = {
    background?: string;
    backgroundBlendMode?:
        | "color-burn"
        | "color-dodge"
        | "color"
        | "darken"
        | "difference"
        | "exclusion"
        | "hard-light"
        | "hue"
        | "lighten"
        | "luminosity"
        | "multiply"
        | "normal"
        | "overlay"
        | "saturation"
        | "screen"
        | "soft-light";
    backgroundClip?: "border-box" | "content-box" | "padding-box" | "text";
    backgroundColor?: string;
    backgroundRepeat?:
        | "no-repeat"
        | "repeat"
        | "round"
        | "space"
        | `repeat-${"x" | "y"}`;
    backgroundSize?:
        | "auto"
        | "contain"
        | "cover"
        | `${number}`
        | `${number}${"%" | "em" | "px" | "rem" | "vh" | "vw"}`;
};

type useBackgroundProperties = {
    image?: StaticImageData;
    imageConfig?: useBackgroundImageConfig;
};

/**
 * Custom hook to use different backgrounds per pages
 *
 * @param props - The properties of the custom hook
 * @param props.image - The image we are adding to the background
 */
export const useBackground = ({
    image,
    imageConfig,
}: useBackgroundProperties): void => {
    /**
     * Runs while DOM is being painted, allows for updates to the dom
     * prior to the user seeing the screen, will avoid flashes
     */
    React.useEffect(() => {
        // Accessing the root element of the document (covers page)
        const body = document.querySelector("body");
        if (body !== null) {
            /**
             * @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
             * @ Adding image as background
             * @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
             */

            // Reason: Checking if image is undefined before accessing it's src attribute
            if (image !== undefined) {
                // Reason: src attribute returns url of image
                body.style.backgroundImage = image.src;
            }

            // Reason: Checking if image config is supplied
            if (imageConfig !== undefined) {
                body.style.background = imageConfig.background ?? "";
                body.style.backgroundSize =
                    imageConfig.backgroundSize ?? "cover";
                body.style.backgroundRepeat =
                    imageConfig.backgroundRepeat ?? "no-repeat";
                body.style.backgroundColor =
                    imageConfig.backgroundColor ?? "none";
                body.style.backgroundClip =
                    imageConfig.backgroundClip ?? "none";
                body.style.backgroundBlendMode =
                    imageConfig.backgroundBlendMode ?? "none";
            }
        }
    }, [image, imageConfig]);
};
