import loading_styles from "@/common/components/LoadingIndicator/LoadingIndicator.module.css";

/**
 * Triggers the loading indicator to begin loading (displaying)
 * @param cancel - Whether to cancel the loading
 */
export const triggerLoading = (cancel = false) => {
    if (document !== undefined) {
        const loadingElement = document.querySelector("#loading_indicator");

        if (loadingElement != null) {
            if (cancel) {
                loadingElement.className = loadingElement.className.replace(
                    ` ${loading_styles.loading}`,
                    "",
                );
            } else {
                loadingElement.className = `${loadingElement.className} ${loading_styles.loading}`;
            }
        }
    }
};
