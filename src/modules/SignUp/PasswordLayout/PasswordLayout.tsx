import React from "react";

import { Regex, SignUpValidationText, SignUpValidationValues } from "@/common";

import styles from "./PasswordLayout.module.css";

type PasswordLayoutProperties = {
    password: string;
};

type PasswordValidationState = {
    hasDigit: boolean;
    hasLowercaseLetter: boolean;
    hasNoSpaces: boolean;
    hasSymbol: boolean;
    hasUppercaseLetter: boolean;
    remainingCharacters: { amount: number; valid: boolean };
};

const PASSWORD_VALIDATION_STATE_DEFAULT_VALUES: PasswordValidationState = {
    hasDigit: false,
    hasLowercaseLetter: false,
    hasNoSpaces: false,
    hasSymbol: false,
    hasUppercaseLetter: false,
    remainingCharacters: {
        amount: SignUpValidationValues.PASSWORD.MAX_LENGTH,
        valid: true,
    },
};

const VALID_ICON = "fa-solid fa-circle";
const INVALID_ICON = "fa-regular fa-circle";

/**
 * Displays all the requirements of the password as it is being entered in, displayed in an overlay component
 *
 * @param props - The properties of the password layout component
 * @param props.password - The password being entered in form
 * @returns The password layout component
 */
export const PasswordLayout = ({
    password,
}: PasswordLayoutProperties): JSX.Element => {
    const [passwordValidationState, setPasswordValidationState] =
        React.useState<PasswordValidationState>(
            PASSWORD_VALIDATION_STATE_DEFAULT_VALUES,
        );

    React.useEffect(() => {
        setPasswordValidationState(
            (oldValidationState: PasswordValidationState) => {
                const clone = { ...oldValidationState };
                clone.remainingCharacters = {
                    amount:
                        password.length >
                        SignUpValidationValues.PASSWORD.MAX_LENGTH
                            ? 0
                            : SignUpValidationValues.PASSWORD.MAX_LENGTH -
                              password.length,
                    valid:
                        password.length <
                        SignUpValidationValues.PASSWORD.MAX_LENGTH,
                };
                clone.hasDigit = Regex.HAS_DIGIT.test(password);
                clone.hasLowercaseLetter = Regex.HAS_LOWERCASE.test(password);
                clone.hasUppercaseLetter = Regex.HAS_UPPERCASE.test(password);
                clone.hasSymbol = Regex.HAS_SYMBOL.test(password);
                clone.hasNoSpaces = Regex.NO_SPACES.test(password);
                return clone;
            },
        );
    }, [password]);

    return (
        <div className={styles.password_layout}>
            <div className={styles.password_requirement}>
                <i
                    className={`${
                        passwordValidationState.hasNoSpaces
                            ? VALID_ICON
                            : INVALID_ICON
                    } ${
                        passwordValidationState.hasNoSpaces
                            ? styles.password_layout_valid
                            : styles.password_layout_invalid
                    }`}
                />
                <span>{SignUpValidationText.PASSWORD.NO_SPACES}</span>
            </div>
            <div className={styles.password_requirement}>
                <i
                    className={`${
                        passwordValidationState.hasLowercaseLetter
                            ? VALID_ICON
                            : INVALID_ICON
                    } ${
                        passwordValidationState.hasLowercaseLetter
                            ? styles.password_layout_valid
                            : styles.password_layout_invalid
                    }`}
                />
                <span>{SignUpValidationText.PASSWORD.HAS_LOWERCASE}</span>
            </div>
            <div className={styles.password_requirement}>
                <i
                    className={`${
                        passwordValidationState.hasUppercaseLetter
                            ? VALID_ICON
                            : INVALID_ICON
                    } ${
                        passwordValidationState.hasUppercaseLetter
                            ? styles.password_layout_valid
                            : styles.password_layout_invalid
                    }`}
                />
                <span>{SignUpValidationText.PASSWORD.HAS_UPPERCASE}</span>
            </div>
            <div className={styles.password_requirement}>
                <i
                    className={`${
                        passwordValidationState.hasSymbol
                            ? VALID_ICON
                            : INVALID_ICON
                    } ${
                        passwordValidationState.hasSymbol
                            ? styles.password_layout_valid
                            : styles.password_layout_invalid
                    }`}
                />
                <span>{SignUpValidationText.PASSWORD.HAS_SYMBOL}</span>
            </div>
            <div className={styles.password_requirement}>
                <i
                    className={`${
                        passwordValidationState.hasDigit
                            ? VALID_ICON
                            : INVALID_ICON
                    } ${
                        passwordValidationState.hasDigit
                            ? styles.password_layout_valid
                            : styles.password_layout_invalid
                    }`}
                />
                <span>{SignUpValidationText.PASSWORD.HAS_DIGIT}</span>
            </div>
            <div className={styles.password_requirement}>
                <i
                    className={`${
                        passwordValidationState.remainingCharacters.valid
                            ? VALID_ICON
                            : INVALID_ICON
                    } ${
                        passwordValidationState.remainingCharacters.valid
                            ? styles.password_layout_valid
                            : styles.password_layout_invalid
                    }`}
                />
                <span>{`${passwordValidationState.remainingCharacters.amount} characters remaining`}</span>
            </div>
        </div>
    );
};
