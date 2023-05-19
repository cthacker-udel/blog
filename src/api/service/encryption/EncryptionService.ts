/* eslint-disable import/no-nodejs-modules -- disabled */
/* eslint-disable class-methods-use-this -- disabled */
import { pbkdf2Sync, randomBytes } from "node:crypto";

import type { EncryptionResult } from "@/@types/api/Encryption";

/**
 * All encryption methods fall under this class
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
        const salt = randomBytes(12).toString("hex");
        const hash = pbkdf2Sync(password, salt, 100, 128, "sha512").toString(
            "hex",
        );
        return { hash, salt };
    };
}
