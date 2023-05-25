/* eslint-disable no-console -- disabled */
/* eslint-disable unicorn/no-null -- disabled */

import React from "react";
import { toast } from "react-toastify";
import useSWR from "swr";

import type { ApiResponse } from "@/@types";
import { UserService } from "@/api/service";
import type { Notification } from "@/classes";
import { NotificationType } from "@/common/constants/Enums/NotificationType";
import { Endpoints } from "@/constants";

/**
 * Hook for displaying + removing notifications
 */
export const useNotifications = (): void => {
    const { data } = useSWR<ApiResponse<Notification[]>, Error, string>(
        `${Endpoints.USER.BASE}${Endpoints.USER.ALL_NOTIFICATIONS}`,
        null,
    );

    const removeNotification = React.useCallback(
        async (id: string): Promise<void> => {
            await new UserService().removeNotification(id);
        },
        [],
    );

    React.useEffect(() => {
        if (data !== undefined) {
            const { data: notifications } = data;
            if (
                notifications?.length !== undefined &&
                notifications?.length > 0
            ) {
                for (const eachNotification of notifications) {
                    removeNotification(
                        eachNotification._id?.toString() ?? "",
                    ).catch((error) => {
                        console.error(error);
                    });
                    switch (eachNotification.type) {
                        case NotificationType.INFO: {
                            toast.info(eachNotification.message);
                            break;
                        }
                        case NotificationType.PRIMARY: {
                            toast(eachNotification.message);
                            break;
                        }
                        case NotificationType.ERROR: {
                            toast.error(eachNotification.message);
                            break;
                        }
                        case NotificationType.SUCCESS: {
                            toast.success(eachNotification.message);
                            break;
                        }
                        case NotificationType.WARNING: {
                            toast.warning(eachNotification.message);
                            break;
                        }
                        default: {
                            break;
                        }
                    }
                }
            }
        }
    }, [data, removeNotification]);
};
