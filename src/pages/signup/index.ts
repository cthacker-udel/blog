/* eslint-disable require-await -- disabled */
/* eslint-disable @typescript-eslint/require-await -- disabled */
/* eslint-disable import/no-nodejs-modules -- disabled */

import type { IncomingMessage } from "node:http";

import type { GetServerSideProps } from "next";

type GetServerSideProperties = {
    req: IncomingMessage;
};

/**
 * Gets the server side props, mostly used for session verification
 */
export const getServerSideProps: GetServerSideProps = async ({
    req,
}: GetServerSideProperties) => {
    const isLoggedIn = req.headers.cookie?.includes(
        process.env.COOKIE_NAME as unknown as string,
    );

    if (isLoggedIn) {
        return { redirect: { destination: "/dashboard", permanent: false } };
    }

    return { props: {} };
};

export { SignUp as default } from "@/modules";
