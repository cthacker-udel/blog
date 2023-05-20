/* eslint-disable no-console -- disabled */
import {
    type Collection,
    type Db,
    type Document,
    MongoClient,
    ServerApiVersion,
} from "mongodb";

import type { ApiError } from "@/@types";
import { Collections } from "@/constants";

/**
 * Handles all mongo operations, such as collection fetching, and database connection instantiation
 */
export class MongoApi {
    /**
     * The current mongo client instance
     */
    public client: MongoClient;

    /**
     * The current database
     */
    public database?: Db = undefined;

    /**
     * Instantiates the mongo client, and access the database specified in the environment variable or database name specified in the argument
     */
    public constructor() {
        console.log("TRYING TO CONNECT");
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
    }

    /**
     * Connects to the database
     * @param databaseName - The name of the database we are connecting to (optional)
     */
    public connect = async (databaseName?: string): Promise<void> => {
        try {
            this.client = await this.client.connect();
            this.database = this.client.db(
                databaseName ??
                    (process.env.MONGO_DATABASE_NAME as unknown as string),
            );
            console.log("CONNECTED TO MONGO DATABASE");
        } catch (error: unknown) {
            console.log(
                `FAILED TO CONNECT TO MONGO DATABASE ${
                    (error as Error).message
                }`,
            );
        }
    };

    /**
     * Pings the database, checking if it is defined before executing any queries potentially
     *
     * @returns Whether it is connected to a database
     */
    public pingStatus = (): boolean => this.database !== undefined;

    /**
     * Returns the requested collection from the database using the mongodb connection
     *
     * @param collectionName - The name of the collection we are trying to access
     * @returns - The "repository" aka the collection
     */
    public getRepo = async <T extends Document>(
        collectionName: string,
    ): Promise<Collection<T>> => {
        await this.connect();
        if (!this.pingStatus() || this.database === undefined) {
            throw new Error(
                "Database is not connected, cannot request collection",
            );
        }

        return this.database.collection(collectionName);
    };

    /**
     * Logs an error to the error logs collection
     *
     * @param error - The error to log
     */
    public logError = async (error: unknown): Promise<void> => {
        const errorCollection = await this.getRepo<ApiError>(
            Collections.ERRORS,
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
