/**
 *
 * @param name
 * @param stylesheetList
 */
export const findStylesheet = (
    name: string,
    stylesheetList: StyleSheetList,
): CSSStyleDeclaration | undefined => {
    const styleSheets = [...stylesheetList];

    console.log("sheets = ", styleSheets);

    for (const eachStyleSheet of styleSheets) {
        try {
            const rules = [...eachStyleSheet.cssRules];
            const rulesIndex = rules.findIndex(
                (eachRule: CSSRule) =>
                    eachRule.cssText.split(" ")[0].slice(1) === name,
            );

            if (rulesIndex > 0) {
                const foundRules = rules[rulesIndex] as unknown as CSSStyleRule;
                return foundRules.style;
            }
        } catch {}
    }

    return undefined;
};
