/* eslint-disable import/no-nodejs-modules -- disabled */
/* eslint-disable class-methods-use-this -- disabled */
import { createHash, pbkdf2Sync, randomBytes } from "node:crypto";

import type { EncryptionResult } from "@/@types/api/Encryption";

/**
 * All encryption methods, usually involving passwords
 */
export class EncryptionService {
    /**
     * Hashes the password, and returns the salt used and the resultant hash from
     * encrypting it using the password based key derivation function 2
     *
     * @param password - The password to hash
     * @returns The encrypted password, along with it's salt
     */
    public hashPassword = (password: string): EncryptionResult => {
        const salt = this.generateSalt();

        // Pbkdf2 encryption
        const hash = createHash("sha512")
            .update(
                pbkdf2Sync(password, salt, 100, 128, "sha512").toString("hex"),
                "hex",
            )
            .digest("hex");

        return { hash, salt };
    };

    /**
     * Fix hashes the password with the provided salt (used when logging in)
     *
     * @param password - The password to hash
     * @param salt - The salt used to hash the password
     * @returns The hashed password
     */
    public fixedHash = (password: string, salt: string): string => {
        const hash = createHash("sha512")
            .update(
                pbkdf2Sync(password, salt, 100, 128, "sha512").toString("hex"),
            )
            .digest("hex");
        return hash;
    };

    /**
     * Generates a salt used for hashing passwords
     *
     * @param byteLength - The length of the salt, optional
     * @returns The hashed salt
     */
    public generateSalt = (byteLength?: number): string =>
        randomBytes(byteLength ?? 12).toString("hex");
}
