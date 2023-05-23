import { AddPostValidationValues } from "../../ValidationValues/AddPostValidationValues";

export const AddPostValidationText = {
    TITLE: {
        MAX_LENGTH: `Post title cannot be more than ${AddPostValidationValues.TITLE.MAX_LENGTH} characters`,
        REQUIRED: "Title is required",
    },
};
