/* eslint-disable @typescript-eslint/indent -- disabled */
/* eslint-disable @typescript-eslint/no-non-null-assertion -- disabled */
import React from "react";

import { findStylesheet } from "@/common";

type useSimulateTypingProperties = {
    cssClassName: string;
    content: string;
    intervalStart?: number;
    intervalEnd?: number;
    ref: React.RefObject<HTMLElement>;
};

type TypingState = {
    currentlyTyping: boolean;
    started: boolean;
    finished: boolean;
};

/**
 * Simulates typing on the element passed into this hook, with the content required
 *
 * @param props - The properties of the hook to simulate typing
 * @param cssClassName - The name of the css class we will be looking up, and applying styles from (when calculating the width)
 * @param props.content - The content that will be typed into the element
 * @param props.intervalStart - The start of the interval
 * @param props.intervalEnd - The end of the interval
 * @param props.ref - The DOM ref to the component we are injecting the text into
 */
export const useSimulateTyping = ({
    content,
    intervalStart,
    intervalEnd,
    ref,
}: useSimulateTypingProperties): void => {
    const [isPending, startTransition] = React.useTransition();

    /**
     * Whether the operation is finished, ends the useEffect loop
     */
    const [finished, setFinished] = React.useState<boolean>(false);

    /**
     * Whether the operation has started, controls whether the styles are updated
     */
    const [started, setStarted] = React.useState<boolean>(true);

    /**
     * The index of the letter currently being injected
     */
    const [currentTyping, setCurrentTyping] = React.useState<number>(0);

    React.useEffect(() => {
        if (ref.current !== null && started) {
            const hasNotStartedTyping =
                ref.current.getAttribute("typing") === "F";
            if (hasNotStartedTyping) {
                console.log("in if");
                const styleSheet = findStylesheet(
                    ref.current.className,
                    document.styleSheets,
                );
                if (styleSheet !== undefined) {
                    ref.current.style.width = `${styleSheet.fontSize}`;
                }
                ref.current.style.transition = `${ref.current.style.transition} border-right .5s ease-in-out`;
            }
        }
    }, [content.length, ref, started]);

    React.useEffect(() => {
        if (
            ref.current !== null &&
            !isPending &&
            !finished &&
            currentTyping < content.length
        ) {
            ref.current.setAttribute("typing", "T");
            const time =
                Math.random() *
                ((intervalEnd ?? 750) -
                    (intervalStart ?? 250) +
                    (intervalStart ?? 250));
            const element = ref.current;

            setTimeout(() => {
                element.innerHTML = `${element.innerHTML}${content[currentTyping]}`;
                ref.current!.style.borderRight =
                    currentTyping % 2 === 0
                        ? "2px solid transparent"
                        : "2px solid black";

                setCurrentTyping((oldValue) => oldValue + 1);
            }, time);
        }

        if (
            !finished &&
            currentTyping === content.length &&
            ref.current !== null
        ) {
            startTransition(() => {
                setFinished(true);
                setStarted(false);
            });
            ref.current.setAttribute("typing", "F");
            ref.current.style.borderRight = "2px solid transparent";
            ref.current.style.transition = ref.current.style.transition.replace(
                " border-right .5s ease-in-out",
                "",
            );
        }
    }, [
        currentTyping,
        content,
        finished,
        intervalStart,
        intervalEnd,
        isPending,
        ref,
        started,
    ]);
};
