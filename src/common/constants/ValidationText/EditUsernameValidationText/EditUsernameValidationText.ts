import { EditUsernameValidationValues } from "../../ValidationValues";

export const EditUsernameValidationText = {
    USERNAME: {
        MAX_LENGTH: `Username cannot be more than ${EditUsernameValidationValues.USERNAME.MAX_LENGTH} characters long`,
        NO_SPACES: "Spaces are not allowed",
        REQUIRED: "Username is required",
    },
};
