/* eslint-disable no-console -- disabled */
import {
    type Collection,
    type Db,
    MongoClient,
    ServerApiVersion,
} from "mongodb";
import type { NextApiResponse } from "next";

import type { ApiError } from "@/@types";

/**
 *
 */
export class MongoApi {
    public client: MongoClient;

    public database?: Db;

    public collection?: Collection;

    /**
     *
     */
    public constructor(collectionName: string, databaseName?: string) {
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

        this.client
            .connect()
            .then((client: MongoClient) => {
                this.database = client.db(
                    databaseName ??
                        (process.env.MONGO_DATABASE_NAME as unknown as string),
                );
                this.collection = this.database.collection(collectionName);
            })
            .catch((error: unknown) => {
                console.error(
                    `Failed to connect to mongo database ${
                        (error as Error).message
                    }`,
                );
            });
    }

    /**
     * Returns the instantiated collection when this api was created
     *
     * @returns - The "repository" aka the collection
     */
    public getRepo = (): Collection | undefined => this.collection;

    public logError = async (
        error: unknown,
        response?: NextApiResponse,
    ): Promise<void> => {
        if (this.collection !== undefined) {
            const convertedError = error as Error;

            if (convertedError === undefined) {
                return;
            }

            await this.database
                ?.collection(
                    process.env.MONGO_ERROR_COLLECTION as unknown as string,
                )
                .insertOne({
                    message: convertedError.message,
                    stackTrace: convertedError.stack,
                } as ApiError);
            response?.status(500);
            response?.send({ message: convertedError.message });
        }
    };
}
