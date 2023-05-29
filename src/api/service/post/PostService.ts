/* eslint-disable @typescript-eslint/indent -- disabled */
import type { ApiResponse } from "@/@types";
import { Endpoints } from "@/constants";

import { ServiceBaseController } from "../base";
import type { IPostService } from "./IPostService";

/**
 * Client-side implementation of methods invoking the post api
 */
export class PostService extends ServiceBaseController implements IPostService {
    /** @inheritdoc */
    public updatePost = async (
        content: string,
        title: string,
        postId: string,
    ): Promise<ApiResponse<boolean>> => {
        try {
            const response = await this.post<
                boolean,
                { content: string; id: string; title: string }
            >(`${Endpoints.POST.BASE}${Endpoints.POST.UPDATE_CONTENT}`, {
                content,
                id: postId,
                title,
            });

            return response;
        } catch {
            return { data: false };
        }
    };
}
