import React from "react";
import { Key } from "ts-key-enum";

type useCancelAnimationsProperties = {
    endingAnimationIdMapping: { [key: string]: Partial<CSSStyleDeclaration> };
    ids: string[];
    onPressKey?: Key;
};

/**
 * Cancels all animations of all the elements specified in the object passed into this hook
 *
 * @param properties - The object sent into the hook, contains the list of element refs, and the list of element ids to cancel animations for it
 * @param properties.endingAnimationIdMapping - The values that the animation ends on, to replace the styling with the values that are achieved when the animation is complete
 * @param properties.ids - The list of element ids to cancel the animations for
 * @param properties.onPressKey - the key that will trigger the animations to be cancelled
 */
export const useCancelAnimations = ({
    endingAnimationIdMapping,
    ids,
    onPressKey = Key.Enter,
}: useCancelAnimationsProperties): void => {
    const onEnter = React.useCallback(
        (event: KeyboardEvent) => {
            const { key } = event;
            if (key === onPressKey) {
                for (const eachId of ids) {
                    const element = document.querySelector(`#${eachId}`);
                    if (element !== null) {
                        const convertedElement = element as HTMLElement;
                        convertedElement.style.setProperty(
                            "animation",
                            "none",
                            "important",
                        );
                        for (const eachEndingAnimationKey of Object.keys(
                            endingAnimationIdMapping[
                                eachId
                            ] as CSSStyleDeclaration,
                        )) {
                            convertedElement.style.setProperty(
                                eachEndingAnimationKey,
                                endingAnimationIdMapping[eachId][
                                    eachEndingAnimationKey as unknown as number
                                ] as unknown as string,
                                "important",
                            );
                        }
                    }
                }
            }
        },
        [endingAnimationIdMapping, ids, onPressKey],
    );

    React.useEffect(() => {
        document.addEventListener("keydown", onEnter);

        return () => {
            document.removeEventListener("keydown", onEnter);
        };
    }, [onEnter]);
};
