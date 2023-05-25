/* eslint-disable @typescript-eslint/no-explicit-any -- disabled */
import "@/styles/globals.css";
import "react-toastify/dist/ReactToastify.css";

import type { AppProps } from "next/app";
import React from "react";
import { ToastContainer } from "react-toastify";
import { SWRConfig } from "swr/_internal";

import type { ApiResponse } from "@/@types";
import { Layout } from "@/common";

/**
 * Used to initialize pages, control the page initialization and persist layouts between page
 * changes. Keeping state when navigating pages, and injecting additional data into pages, and also adding global css.
 *
 * @param props - The props injected into the app component
 * @param props.Component - The component we are rendering
 * @param props.pageProps - The page props we are passing into the component
 * @returns The app component
 */
const App = ({ Component, pageProps }: AppProps): JSX.Element => (
    <>
        <SWRConfig
            value={{
                fetcher: async (resource: string, _init: any): Promise<any> => {
                    const url = `${window.location.protocol}//${window.location.hostname}:${window.location.port}/api/`;
                    const request = await fetch(`${url}${resource}`);

                    if (request.status === 401) {
                        throw new Error("Invalid user");
                    }

                    const jsonResult = await request.json();
                    const convertedResult = jsonResult as ApiResponse;
                    return convertedResult;
                },
                provider: () => new Map(),
            }}
        >
            <Layout>
                <Component {...pageProps} />
            </Layout>
        </SWRConfig>
        <ToastContainer
            autoClose={5000}
            closeOnClick
            draggable
            hideProgressBar={false}
            newestOnTop={false}
            pauseOnHover
            position="top-right"
            rtl={false}
            theme="light"
        />
    </>
);

export default App;
