/* eslint-disable @typescript-eslint/no-extraneous-class -- disabled */
/* eslint-disable no-console -- disabled */
import {
    type Collection,
    type Db,
    type Document,
    MongoClient,
    ServerApiVersion,
} from "mongodb";

import type { ApiError } from "@/@types";

/**
 * Handles all mongo operations, such as collection fetching, and database connection instantiation
 */
export class MongoApi {
    /**
     * The current mongo client instance
     */
    public static client: MongoClient;

    /**
     * The current database
     */
    public static database?: Db = undefined;

    /**
     * Instantiates the mongo client, and access the database specified in the constructor, else the environment variables
     *
     * @param databaseName - The database you want to connect to
     */
    public constructor(databaseName?: string) {
        MongoApi.client = new MongoClient(
            process.env.MONGO_DB_URL as unknown as string,
            {
                serverApi: {
                    deprecationErrors: true,
                    strict: true,
                    version: ServerApiVersion.v1,
                },
            },
        );

        MongoApi.client
            .connect()
            .then((client: MongoClient) => {
                MongoApi.database = client.db(
                    databaseName ??
                        (process.env.MONGO_DATABASE_NAME as unknown as string),
                );
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
     * Pings the database, checking if it is defined before executing any queries potentially
     *
     * @returns Whether it is connected to a database
     */
    public static pingStatus = (): boolean => this.database !== undefined;

    /**
     * Returns the requested collection from the database using the mongodb connection
     *
     * @param collectionName - The name of the collection we are trying to access
     * @returns - The "repository" aka the collection
     */
    public static getRepo = <T extends Document>(
        collectionName: string,
    ): Collection<T> => {
        if (!this.pingStatus() || MongoApi.database === undefined) {
            throw new Error(
                "Database is not connected, cannot request collection",
            );
        }

        return MongoApi.database.collection(collectionName);
    };

    /**
     * Logs an error to the error logs collection
     *
     * @param error - The error to log
     */
    public static logError = async (error: unknown): Promise<void> => {
        const errorCollection = MongoApi.getRepo<ApiError>(
            process.env.MONGO_ERROR_COLLECTION as unknown as string,
        );
        if (errorCollection !== undefined) {
            const convertedError = error as Error;

            if (convertedError === undefined) {
                throw new Error("Error sent is not an actual exception");
            }

            await errorCollection.insertOne({
                message: convertedError.message,
                stackTrace: convertedError.stack,
            });
        }
    };
}
