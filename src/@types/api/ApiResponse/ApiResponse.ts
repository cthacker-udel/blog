/* eslint-disable @typescript-eslint/no-explicit-any -- disabled */
import type { ApiError } from "../Error";

export type ApiResponse<T = any> = {
    error?: ApiError;
    data: T;
    response?: Response;
};
