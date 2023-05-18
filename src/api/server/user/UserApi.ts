/* eslint-disable @typescript-eslint/indent */
import {
    type Collection,
    type Db,
    MongoClient,
    ServerApiVersion,
} from "mongodb";
import type { NextApiRequest, NextApiResponse } from "next";

import type { IUserApi } from "./IUserApi";
import { User } from "@/@types";

/**
 *
 */
export class UserApi implements IUserApi {
    public client?: MongoClient;

    public database?: Db;

    public collection?: Collection;

    /**
     * Instantiates the client instance
     */
    public instantiateClient = async (): Promise<void> => {
        this.client = new MongoClient(
            process.env.MONGO_DB_URL as unknown as string,
            {
                serverApi: {
                    deprecationErrors: true,
                    strict: true,
                    version: ServerApiVersion.v1,
                },
            },
        );

        await this.client.connect();
        this.database = this.client.db(
            process.env.MONGO_DATABASE_NAME as unknown as string,
        );
        this.collection = this.database.collection(
            process.env.MONGO_USER_COLLECTION as unknown as string,
        );
    };

    /** @inheritdoc */
    public signUp = async (
        request: NextApiRequest,
        response: NextApiResponse,
    ): Promise<void> => {
        try {
            await this.instantiateClient();

            const requestBody = request.body as Pick<
                User,
                "password" | "username"
            >;

            if (
                requestBody.username === undefined ||
                requestBody.password === undefined
            ) {
                throw new Error("Invalid credentials supplied");
            }

            const { username, password } = requestBody;

            const response = await this.collection.insertOne({});
        } catch (error: unknown) {
            response.status(500);
            response.send({ error });
        }
    };
}
