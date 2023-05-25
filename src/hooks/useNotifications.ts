/* eslint-disable unicorn/no-null -- disabled */

import useSWR from "swr";

import type { Notification } from "@/classes";
import { Endpoints } from "@/constants";

/**
 *
 */
export const useNotifications = (): void => {
    const { data } = useSWR<Notification[], Error, string>(
        `${Endpoints.USER.BASE}${Endpoints.USER.ALL_NOTIFICATIONS}`,
        null,
        {
            refreshInterval: 2000,
        },
    );

    const removeNotification = React.useCallback(async (id: string) => {
        const { data } = await 
    }, []);

    React.useEffect(() => {
        if (data?.length !== undefined && data?.length > 0) {
            data.forEach((eachNotification: Notification) => {});
        }
    }, []);
};
