import { Regex } from "../../Regex";

export const SignUpValidationValues = {
    USERNAME: {
        MAX_LENGTH: 30,
        NO_SPACES: Regex.NO_SPACES,
        REQUIRED: true,
    },
};
