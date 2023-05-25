/* eslint-disable @typescript-eslint/no-floating-promises -- disabled */
import { useRouter } from "next/router";
import React from "react";

import { UserService } from "@/api/service";

/**
 * Validates that the user session exists, and if not, sends them to the home page
 */
export const useSession = (): void => {
    const router = useRouter();

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
};
