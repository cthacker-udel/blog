/* eslint-disable @typescript-eslint/no-extraneous-class -- disabled */
/**
 *
 */
export abstract class IUserService {
    /**
     * Attempts to sign a user up in the database
     *
     * @param _username - The username that is being registered in the application
     * @param _encryptedInformation - The password that the user entered in
     * @returns Whether or not the user signed up
     */
    public static signUp: (
        _username: string,
        _password: string,
    ) => Promise<boolean>;
}
