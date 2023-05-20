/* eslint-disable class-methods-use-this -- disabled */
import type { ApiResponse } from "@/@types";

/**
 * Base service class for sending requests to the server-side of this application, used for commonality and reusability for the codebase regarding client-side api requests
 */
export class ServiceBaseController {
    /**
     * [GET] Makes a get request to the server-side api, and captures it's response
     *
     * @param endpoint - The url we are calling
     * @param customHeaders - The custom headers we are adding on the request
     * @param queryParameters - The query parameters we are appending onto the endpoint
     * @param fetchOptionsOverride - The overriding options which override all options passed into the request
     * @returns The response from the api
     */
    public get = async <T>(
        endpoint: string,
        customHeaders?: HeadersInit,
        queryParameters?: { [key: string]: string },
        fetchOptionsOverride?: RequestInit,
    ): Promise<ApiResponse<T>> => {
        const queryString = new URLSearchParams(queryParameters);

        const response = await fetch(
            `${process.env.NEXT_PUBLIC_BASE_URL}${endpoint}${
                queryParameters === undefined
                    ? ""
                    : `?${encodeURIComponent(queryString.toString())}`
            }`,
            {
                credentials: "include",
                headers: { ...customHeaders },
                method: "GET",
                ...fetchOptionsOverride,
            },
        );

        const data = await response.json();

        return { ...data, response } as ApiResponse<T>;
    };

    /**
     * [POST] Sends a post request to the server, and captures it's response
     *
     * @param endpoint - The url we are calling
     * @param body - The body of the put request
     * @param customHeaders - The headers we are sending alongside the request
     * @param queryParameters - The query parameter we are appending onto the endpoint
     * @param fetchOptionsOverride - Backdoor, used for overriding all the request options
     * @returns The response from the server, along with the data returned (if any)
     */
    public post = async <T, K>(
        endpoint: string,
        body: K,
        customHeaders?: HeadersInit,
        queryParameters?: { [key: string]: string },
        fetchOptionsOverride?: RequestInit,
    ): Promise<ApiResponse<T>> => {
        const queryString = new URLSearchParams(queryParameters);

        const response = await fetch(
            `${process.env.NEXT_PUBLIC_BASE_URL}${endpoint}${
                queryParameters === undefined
                    ? ""
                    : `?${encodeURIComponent(queryString.toString())}`
            }`,
            {
                body: body as BodyInit,
                credentials: "include",
                headers: { ...customHeaders },
                method: "POST",
                ...fetchOptionsOverride,
            },
        );

        const data = await response.json();

        return { ...data, response } as ApiResponse<T>;
    };

    /**
     * [PUT] Sends a put request to the server, and captures it's response
     *
     * @param endpoint - The url we are calling
     * @param body - The body of the put request
     * @param customHeaders - The headers we are sending alongside the request
     * @param queryParameters - The query parameter we are appending onto the endpoint
     * @param fetchOptionsOverride - Backdoor, used for overriding all the request options
     * @returns The response from the server, along with the data returned (if any)
     */
    public put = async <T, K>(
        endpoint: string,
        body: K,
        customHeaders?: HeadersInit,
        queryParameters?: { [key: string]: string },
        fetchOptionsOverride?: RequestInit,
    ): Promise<ApiResponse<T>> => {
        const queryString = new URLSearchParams(queryParameters);

        const response = await fetch(
            `${process.env.NEXT_PUBLIC_BASE_URL}${endpoint}${
                queryParameters === undefined
                    ? ""
                    : `?${encodeURIComponent(queryString.toString())}`
            }`,
            {
                body: body as BodyInit,
                credentials: "include",
                headers: { ...customHeaders },
                method: "PUT",
                ...fetchOptionsOverride,
            },
        );

        const data = await response.json();

        return { ...data, response } as ApiResponse<T>;
    };

    /**
     * [PATCH] Sends a patch request to the server, and captures it's response
     *
     * @param endpoint - The url we are calling
     * @param body - The body of the put request
     * @param customHeaders - The headers we are sending alongside the request
     * @param queryParameters - The query parameter we are appending onto the endpoint
     * @param fetchOptionsOverride - Backdoor, used for overriding all the request options
     * @returns The response from the server, along with the data returned (if any)
     */
    public patch = async <T, K>(
        endpoint: string,
        body: K,
        customHeaders?: HeadersInit,
        queryParameters?: { [key: string]: string },
        fetchOptionsOverride?: RequestInit,
    ): Promise<ApiResponse<T>> => {
        const queryString = new URLSearchParams(queryParameters);

        const response = await fetch(
            `${process.env.NEXT_PUBLIC_BASE_URL}${endpoint}${
                queryParameters === undefined
                    ? ""
                    : `?${encodeURIComponent(queryString.toString())}`
            }`,
            {
                body: body as BodyInit,
                credentials: "include",
                headers: { ...customHeaders },
                method: "PATCH",
                ...fetchOptionsOverride,
            },
        );

        const data = await response.json();

        return { ...data, response } as ApiResponse<T>;
    };

    /**
     * [OPTIONS] Sends a options request to the server, and captures it's response
     *
     * @param endpoint - The url we are calling
     * @param body - The body of the put request
     * @param customHeaders - The headers we are sending alongside the request
     * @param queryParameters - The query parameter we are appending onto the endpoint
     * @param fetchOptionsOverride - Backdoor, used for overriding all the request options
     * @returns The response from the server, along with the data returned (if any)
     */
    public options = async <T, K>(
        endpoint: string,
        body: K,
        customHeaders?: HeadersInit,
        queryParameters?: { [key: string]: string },
        fetchOptionsOverride?: RequestInit,
    ): Promise<ApiResponse<T>> => {
        const queryString = new URLSearchParams(queryParameters);

        const response = await fetch(
            `${process.env.NEXT_PUBLIC_BASE_URL}${endpoint}${
                queryParameters === undefined
                    ? ""
                    : `?${encodeURIComponent(queryString.toString())}`
            }`,
            {
                body: body as BodyInit,
                credentials: "include",
                headers: { ...customHeaders },
                method: "OPTIONS",
                ...fetchOptionsOverride,
            },
        );

        const data = await response.json();

        return { ...data, response } as ApiResponse<T>;
    };
}
