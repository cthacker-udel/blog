/* eslint-disable import/no-nodejs-modules -- disabled */

import type { IncomingMessage, ServerResponse } from "node:http";

import type { GetServerSideProps } from "next";

import { UserApi } from "@/api/server";

type GetServerSideProperties = {
    req: IncomingMessage;
    res: ServerResponse;
};

/**
 * Gets the server side props, mostly used for session verification
 */
export const getServerSideProps: GetServerSideProps = async ({
    req,
    res,
}: GetServerSideProperties) => {
    const isLoggedIn = req.headers.cookie?.includes(
        process.env.COOKIE_NAME as unknown as string,
    );

    if (!isLoggedIn) {
        await new UserApi().logout(req, res);
        return { redirect: { destination: "/", permanent: false } };
    }

    return { props: {} };
};

export { Dashboard as default } from "@/modules";
