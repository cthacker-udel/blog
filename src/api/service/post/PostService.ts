/* eslint-disable @typescript-eslint/indent -- disabled */
import type { ApiResponse, UpdatePostPayload } from "@/@types";
import { Endpoints } from "@/constants";

import { ServiceBaseController } from "../base";
import type { IPostService } from "./IPostService";

/**
 * Client-side implementation of methods invoking the post api
 */
export class PostService extends ServiceBaseController implements IPostService {
    /** @inheritdoc */
    public updatePost = async (
        htmlContent: string,
        textContent: string,
        title: string,
        postId: string,
    ): Promise<ApiResponse<boolean>> => {
        try {
            const response = await this.post<boolean, UpdatePostPayload>(
                `${Endpoints.POST.BASE}${Endpoints.POST.UPDATE_CONTENT}`,
                {
                    htmlContent,
                    id: postId,
                    textContent,
                    title,
                },
            );

            return response;
        } catch {
            return { data: false };
        }
    };
}
