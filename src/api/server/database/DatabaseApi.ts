/* eslint-disable node/no-extraneous-import -- disabled */
/* eslint-disable no-console -- disabled */
import type { RedisClientType } from "@redis/client";
import {
    type Collection,
    type Db,
    type Document,
    MongoClient,
    ServerApiVersion,
} from "mongodb";
import { createClient } from "redis";

import type { ApiError } from "@/@types";
import { Collections } from "@/constants";

/**
 * Contains all clients that directly interact with external services such as databases, etc.
 */
export class DatabaseApi {
    /**
     * The mongo client
     */
    public mongoClient: MongoClient;

    /**
     * The mongo database instance
     */
    public database?: Db = undefined;

    /**
     * The redis client
     */
    public redisClient: RedisClientType;

    /**
     * No-arg constructor, that instantiates all the databases
     */
    public constructor() {
        this.mongoClient = new MongoClient(
            process.env.MONGO_DB_URL as unknown as string,
            {
                serverApi: {
                    deprecationErrors: true,
                    strict: true,
                    version: ServerApiVersion.v1,
                },
            },
        );
        this.redisClient = createClient({
            url: `redis://${process.env.REDIS_USERNAME as unknown as string}:${
                process.env.REDIS_PASSWORD as unknown as string
            }@redis-15540.c17.us-east-1-4.ec2.cloud.redislabs.com:15540`,
        });
    }

    /**
     * Connects to the database
     * @param databaseName - The name of the database we are connecting to (optional)
     */
    public connectMongoClient = async (
        databaseName?: string,
    ): Promise<void> => {
        try {
            this.mongoClient = await this.mongoClient.connect();
            this.database = this.mongoClient.db(
                databaseName ??
                    (process.env.MONGO_DATABASE_NAME as unknown as string),
            );
        } catch (error: unknown) {
            console.log(
                `FAILED TO CONNECT TO MONGO DATABASE ${
                    (error as Error).message
                }`,
            );
        }
    };

    /**
     * Starts the mongo transaction, connecting to the database
     */
    public startMongoTransaction = async (): Promise<void> => {
        await this.connectMongoClient();
    };

    /**
     * Disconnects the mongo client
     */
    public closeMongoTransaction = async (): Promise<void> => {
        await this.mongoClient.close();
    };

    /**
     * Starts the redis transaction, connecting to the database
     */
    public startRedisTransaction = async (): Promise<void> => {
        await this.redisClient.connect();
    };

    /**
     * Disconnects the redis client
     */
    public closeRedisTransaction = async (): Promise<void> => {
        await this.redisClient.disconnect();
    };

    /**
     * Pings the database, checking if it is defined before executing any queries potentially
     *
     * @returns Whether it is connected to a database
     */
    public pingMongoStatus = (): boolean => this.database !== undefined;

    /**
     * Returns the requested collection from the database using the mongodb connection
     *
     * @param collectionName - The name of the collection we are trying to access
     * @returns - The "repository" aka the collection
     */
    public getMongoRepo = <T extends Document>(
        collectionName: string,
    ): Collection<T> => {
        if (!this.pingMongoStatus() || this.database === undefined) {
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
    public logMongoError = async (error: unknown): Promise<void> => {
        const errorCollection = this.getMongoRepo<ApiError>(Collections.ERRORS);
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
