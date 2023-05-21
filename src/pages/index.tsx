import Head from "next/head";
import React from "react";

import { Landing } from "@/modules";

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
        </Head>
        <Landing />
    </>
);

export default Home;
