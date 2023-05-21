import { Regex } from "../../Regex";

export const SignUpValidationValues = {
    PASSWORD: {
        MAX_LENGTH: 75,
        NO_SPACES: "Spaces are not allowed",
        REQUIRED: "Password is required",
    },
    USERNAME: {
        MAX_LENGTH: 30,
        NO_SPACES: Regex.NO_SPACES,
        REQUIRED: true,
    },
};
