import React from "react";
import { Key } from "ts-key-enum";

type useSimulateTypingProperties = {
    cssClassName?: string;
    content: string;
    intervalStart?: number;
    intervalEnd?: number;
    ref: React.RefObject<HTMLElement>;
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
    /**
     * The index of the letter currently being injected
     */
    const [currentTyping, setCurrentTyping] = React.useState<number>(0);

    const cutOffAnimation = React.useCallback(
        (event: KeyboardEvent) => {
            const { key } = event;
            if (key === Key.Enter) {
                const element = ref.current;
                if (element !== null) {
                    element.innerHTML = `${content}`;
                    setCurrentTyping(content.length);
                }
            }
        },
        [content, ref],
    );

    React.useEffect(() => {
        document.addEventListener("keydown", cutOffAnimation);

        if (ref.current !== null && currentTyping < content.length) {
            const time =
                Math.random() *
                ((intervalEnd ?? 750) -
                    (intervalStart ?? 250) +
                    (intervalStart ?? 250));
            const element = ref.current;

            setTimeout(() => {
                if (element.innerHTML !== content) {
                    element.innerHTML = `${element.innerHTML}${content[currentTyping]}`;
                    setCurrentTyping((oldValue) => oldValue + 1);
                }
            }, time);
        }

        if (currentTyping === content.length && ref.current !== null) {
            ref.current.style.borderRight = "2px solid transparent";
            ref.current.style.animation = "none";
        }

        return () => {
            document.removeEventListener("keydown", cutOffAnimation);
        };
    }, [
        currentTyping,
        cutOffAnimation,
        content,
        intervalStart,
        intervalEnd,
        ref,
    ]);
};
