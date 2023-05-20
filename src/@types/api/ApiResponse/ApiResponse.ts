import type { ApiError } from "../Error";

export type ApiResponse<T> = {
    error?: ApiError;
    data: T;
    response: Response;
};
