/* eslint-disable require-await -- disabled */
/* eslint-disable @typescript-eslint/require-await -- disabled */
/* eslint-disable import/no-nodejs-modules -- disabled */
import type { IncomingMessage } from "node:http";

import type { GetServerSideProps } from "next";
import Head from "next/head";
import React from "react";

import { Landing } from "@/modules";

type GetServerSideProperties = {
    req: IncomingMessage;
};

/**
 *
 * @returns
 */
const Home = (): JSX.Element => (
    <>
        <Head>
            <meta content="summary_large_image" name="twitter:card" />
            <meta content="#FF0000" name="theme-color" />
            <meta content="website" property="og:type" />
            <meta
                content="https://cthackerblog.vercel.app/"
                property="og:url"
            />
            <meta
                content="CThacker blog - The Thack is Back"
                property="og:title"
            />
            <meta
                content="Blog about me, Cameron Thacker, follow my journey as I wade through the waters of computer science, creating applications, and learning interesting things along the way!"
                property="og:description"
            />
            <meta
                content="https://upload.wikimedia.org/wikipedia/en/8/81/Wario.png"
                property="og:image"
            />

            <meta
                content="width=device-width, initial-scale=1"
                name="viewport"
            />
            <link href="/icon.ico" rel="icon" />
            <title>{"Cameron's Blog"}</title>
        </Head>
        <Landing />
    </>
);

/**
 * Gets the properties of the component server-side before rendering the component for the user
 *
 * @param props - The properties of the server-side props
 * @returns The ssr properties of the component, and redirects if user is currently logged in
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

export default Home;
