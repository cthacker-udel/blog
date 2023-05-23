/* eslint-disable brace-style -- disabled */
/* eslint-disable @typescript-eslint/brace-style -- disabled */
import type { ApiResponse } from "@/@types";
import { Endpoints } from "@/constants";

import { ServiceBaseController } from "../base";
import type { IAdminService } from "./IAdminService";

/**
 * Handles all client-side interaction with the admin api
 */
export class AdminService
    extends ServiceBaseController
    implements IAdminService
{
    /** @inheritdoc */
    public requestAdminAccess = async (): Promise<ApiResponse<boolean>> => {
        const response = await this.get<boolean>(
            `${Endpoints.ADMIN.BASE}${Endpoints.ADMIN.REQUEST_ACCESS}`,
        );

        return response;
    };
}
