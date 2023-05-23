/* eslint-disable @typescript-eslint/indent -- disabled */
/* eslint-disable import/no-nodejs-modules -- disabled */

import type { IncomingMessage, ServerResponse } from "node:http";

import type { GetServerSideProps, NextApiRequest, NextApiResponse } from "next";

import { UserApi } from "@/api/server";
import type { UserRoles } from "@/common";

type GetServerSideProperties = {
    req: IncomingMessage;
    res: ServerResponse;
};

type DashboardServerSideProperties = {
    createdAt: string;
    role: UserRoles;
    username: string;
};

/**
 * Gets the server side props, mostly used for session verification
 */
export const getServerSideProps: GetServerSideProps<
    DashboardServerSideProperties
> = async ({ req, res }: GetServerSideProperties) => {
    const isLoggedIn = req.headers.cookie?.includes(
        process.env.COOKIE_NAME as unknown as string,
    );

    if (!isLoggedIn) {
        await new UserApi().logout(req, res as NextApiResponse);
        return { redirect: { destination: "/", permanent: false } };
    }

    const userInformation = await new UserApi().ssGetDashboardCredentials(
        req as NextApiRequest,
    );

    const { createdAt, role, username } = userInformation;

    if (
        createdAt === undefined ||
        role === undefined ||
        username === undefined
    ) {
        await new UserApi().logout(req, res as NextApiResponse);
        return { redirect: { destination: "/", permanent: false } };
    }

    return { props: { createdAt: createdAt.toString(), role, username } };
};

export { Dashboard as default } from "@/modules";
