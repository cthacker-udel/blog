import React from "react";
import { usePathname, useSearchParams } from "next/navigation";
import styles from "./LoadingIndicator.module.css";
import { ClockLoader } from "react-spinners";
import { triggerLoading } from "@/common/helpers";
import Script from "next/script";

export const LoadingIndicator = (): JSX.Element => {
    const pathName = usePathname();
    const searchParams = useSearchParams();
    const loadingRef = React.createRef<HTMLDivElement>();

    const isLoading = React.useCallback(() => {
        console.log("trigger loading");
        triggerLoading();
    }, []);

    React.useEffect(() => {
        const url = `${pathName}${searchParams}`;
        console.log("url", url);
        if (loadingRef.current !== null) {
            loadingRef.current.className =
                loadingRef.current?.className.replace(
                    ` ${styles.loading_indicator_loading}`,
                    "",
                );
        }
    }, [pathName, searchParams]);

    React.useEffect(() => {
        document.addEventListener("readystatechange", isLoading);

        return () => {
            document.removeEventListener("readystatechange", isLoading);
        };
    }, []);

    return (
        <>
            <div
                className={`${styles.loading_spinner}`}
                id="loading_indicator"
                ref={loadingRef}
            >
                <ClockLoader size={100} speedMultiplier={2} />
            </div>
        </>
    );
};
