import type { ApiResponse } from "@/@types";

export interface IAdminService {
    /**
     * [Session Required]
     * Attempts to send a request for admin access to the admin email, once confirmed, user is given admin access
     *
     * @returns Whether the request was successfully sent
     */
    requestAdminAccess: () => Promise<ApiResponse<boolean>>;
}
