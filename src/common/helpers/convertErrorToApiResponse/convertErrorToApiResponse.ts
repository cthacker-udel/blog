import type { ApiResponse } from "@/@types";

/**
 * Converts an exception into an api response
 *
 * @param error - The error to convert into an api response
 * @returns The error converted into an api response
 */
export const convertErrorToApiResponse = <T>(
    error: unknown,
    data: T,
): ApiResponse<T> => {
    const convertedError = error as Error;

    if (convertedError === undefined) {
        throw new Error("Cannot convert error to exception");
    }

    return {
        data,
        error: {
            message: convertedError.message,
            stackTrace: convertedError.stack,
        },
    };
};
