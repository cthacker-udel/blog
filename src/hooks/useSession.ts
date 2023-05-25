/* eslint-disable unicorn/no-null -- disabled */
/* eslint-disable @typescript-eslint/no-floating-promises -- disabled */
import { useRouter } from "next/router";
import React from "react";
import useSWR from "swr";

import type { ApiResponse } from "@/@types";
import { UserService } from "@/api/service";
import { Endpoints } from "@/constants";

/**
 * Validates that the user session exists, and if not, sends them to the home page
 */
export const useSession = (): void => {
    const router = useRouter();
    const { data, error } = useSWR<ApiResponse<boolean>, Error, string>(
        `${Endpoints.USER.BASE}${Endpoints.USER.VALIDATE_SESSION}`,
        null,
        { refreshInterval: 60_000 },
    );

    React.useEffect(() => {
        if (document !== undefined) {
            const cookie = document.cookie;
            if (
                !cookie.includes(
                    process.env.NEXT_PUBLIC_COOKIE_NAME as unknown as string,
                )
            ) {
                new UserService()
                    .logout()
                    .then(() => {
                        router.push("/");
                    })
                    .catch(() => {
                        router.push("/");
                    });
            }
        }
    }, [router]);

    React.useEffect(() => {
        if (data !== undefined) {
            const { data: isSessionValid } = data;
            if (!isSessionValid || error !== undefined) {
                new UserService()
                    .logout()
                    .then(() => {
                        router.push("/");
                    })
                    .catch(() => {
                        router.push("/");
                    });
            }
        }
    }, [data, error, router]);
};
