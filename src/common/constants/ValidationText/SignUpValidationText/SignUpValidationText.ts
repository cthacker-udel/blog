import { SignUpValidationValues } from "../../ValidationValues";

export const SignUpValidationText = {
    PASSWORD: {
        HAS_DIGIT: "Contains digit",
        HAS_LOWERCASE: "Contains lowercase letter",
        HAS_SYMBOL: "Contains symbol",
        HAS_UPPERCASE: "Contains uppercase letter",
        MAX_LENGTH: 75,
        NO_SPACES: "Contains no spaces",
    },
    USERNAME: {
        MAX_LENGTH: `Username cannot be more than ${SignUpValidationValues.USERNAME.MAX_LENGTH} characters long`,
        NO_SPACES: "Spaces are not allowed",
        REQUIRED: "Username is required",
    },
};
