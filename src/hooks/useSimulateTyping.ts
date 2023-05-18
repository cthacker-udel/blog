import React from "react";

type useSimulateTypingProperties = {
    content: string;
    intervalStart?: number;
    intervalEnd?: number;
    ref: React.RefObject<HTMLElement>;
};

/**
 *
 * @param param0
 */
export const useSimulateTyping = ({
    content,
    intervalStart,
    intervalEnd,
    ref,
}: useSimulateTypingProperties): void => {
    const [finished, setFinished] = React.useState<boolean>(false);
    const [currentTyping, setCurrentTyping] = React.useState<number>(0);

    React.useEffect(() => {
        if (
            ref.current !== null &&
            !finished &&
            currentTyping < content.length
        ) {
            const time =
                Math.random() *
                ((intervalEnd ?? 750) -
                    (intervalStart ?? 250) +
                    (intervalStart ?? 250));
            const element = ref.current;
            setTimeout(() => {
                element.innerHTML = `${element.innerHTML}${content[currentTyping]}`;
                setCurrentTyping((oldValue) => oldValue + 1);
            }, time);
        }

        if (!finished && currentTyping === content.length) {
            setFinished(true);
        }
    }, [currentTyping, content, finished, intervalStart, intervalEnd, ref]);
};
