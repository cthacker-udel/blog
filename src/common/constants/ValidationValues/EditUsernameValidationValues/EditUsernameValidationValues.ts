import { Regex } from "../../Regex";

export const EditUsernameValidationValues = {
    USERNAME: {
        MAX_LENGTH: 30,
        NO_SPACES: Regex.NO_SPACES,
        REQUIRED: true,
    },
};
