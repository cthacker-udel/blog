import React from "react";

/**
 * Injects a className into the layout element of the DOM
 *
 * @param className - The className to inject into the layout element
 */
export const useLayoutInjector = (className: string): void => {
    React.useEffect(() => {
        const layout = document.querySelector("#layout");

        if (layout !== null) {
            layout.className = `${layout.className} ${className}`;
        }
    }, [className]);
};
