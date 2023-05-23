import { useRouter } from "next/router";
import React from "react";
import { Form, Modal, OverlayTrigger } from "react-bootstrap";
import type { OverlayInjectedProps } from "react-bootstrap/esm/Overlay";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { Key } from "ts-key-enum";

import { UserService } from "@/api/service";
import { generatePopover } from "@/common";

import styles from "./AddPostModal.module.css";

type AddPostModalProperties = {
    onHide: () => void;
    showAddPostModal: boolean;
};

type FormValues = {
    title: string;
};

const ADD_POST_DEFAULT_VALUES: FormValues = {
    title: "",
};

/**
 *
 * @returns
 */
export const AddPostModal = ({
    onHide,
    showAddPostModal,
}: AddPostModalProperties): JSX.Element => {
    const { clearErrors, formState, getValues, register, reset } =
        useForm<FormValues>({
            criteriaMode: "all",
            defaultValues: ADD_POST_DEFAULT_VALUES,
            delayError: 100,
            mode: "all",
            reValidateMode: "onChange",
        });

    const { dirtyFields, errors, isDirty, isValidating } = formState;

    const router = useRouter();

    const editUsername = React.useCallback(async () => {
        if (
            dirtyFields.title !== undefined &&
            errors.title !== undefined &&
            isDirty &&
            !isValidating
        ) {
            const addingPostToast = toast.loading("Adding post...");
            const { title } = getValues();
            const { data } = await new UserService().addPost(title);
            if (data ?? false) {
                toast.update(addingPostToast, {
                    autoClose: 1500,
                    isLoading: false,
                    render: "Successfully added post!",
                    type: "success",
                });
            } else {
                toast.update(addingPostToast, {
                    autoClose: 1500,
                    isLoading: false,
                    render: "Failed to add post",
                    type: "error",
                });
            }
        }
    }, [dirtyFields.title, errors.title, getValues, isDirty, isValidating]);

    const onClose = React.useCallback(() => {
        clearErrors();
        reset();
        onHide();
    }, [clearErrors, onHide, reset]);

    return (
        <Modal
            contentClassName={styles.edit_username_modal_content}
            onHide={(): void => {
                onClose();
            }}
            show={showAddPostModal}
        >
            <Modal.Body
                onKeyDown={async (
                    keyEvent: React.KeyboardEvent<HTMLDivElement>,
                ): Promise<void> => {
                    const { key } = keyEvent;
                    if (key === Key.Enter) {
                        await editUsername();
                    }
                }}
            >
                <Form.Floating>
                    <OverlayTrigger
                        overlay={(
                            properties: OverlayInjectedProps,
                        ): JSX.Element =>
                            generatePopover(
                                properties,
                                errors.title === undefined
                                    ? "Press Enter to confirm"
                                    : errors.title?.message,
                                errors.title === undefined ? (
                                    <div
                                        className={
                                            styles.username_popover_header
                                        }
                                    >
                                        <i
                                            className={`fa-solid fa-circle-check fa-beat ${styles.username_success_icon}`}
                                        />
                                        <span
                                            className={
                                                styles.username_error_header_text
                                            }
                                        >
                                            {"Username is valid!"}
                                        </span>
                                        <i
                                            className={`fa-solid fa-circle-check fa-beat ${styles.username_success_icon}`}
                                        />
                                    </div>
                                ) : (
                                    <div
                                        className={
                                            styles.username_popover_header
                                        }
                                    >
                                        <i
                                            className={`fa-solid fa-circle-exclamation fa-spin ${styles.username_error_icon}`}
                                        />
                                        <span
                                            className={
                                                styles.username_error_header_text
                                            }
                                        >
                                            {"Username Error"}
                                        </span>
                                        <i
                                            className={`fa-solid fa-circle-exclamation fa-spin ${styles.username_error_icon}`}
                                        />
                                    </div>
                                ),
                                {
                                    popoverBodyClassNameOverride:
                                        styles.username_popover_body,
                                    popoverClassNameOverride: `${
                                        styles.username_popover
                                    } ${
                                        errors.title === undefined
                                            ? styles.username_popover_success
                                            : styles.username_popover_error
                                    }`,
                                    popoverHeaderClassNameOverride:
                                        styles.username_error_popover_header,
                                },
                            )
                        }
                        placement={
                            errors.title === undefined ? "right" : "left"
                        }
                        show={dirtyFields.title !== undefined}
                    >
                        <Form.Control
                            autoComplete="off"
                            className={styles.edit_username_form}
                            id="edit_username_form"
                            placeholder="Username"
                            type="text"
                            {...register("title", {
                                maxLength: {
                                    message:
                                        EditUsernameValidationText.USERNAME
                                            .MAX_LENGTH,
                                    value: EditUsernameValidationValues.USERNAME
                                        .MAX_LENGTH,
                                },
                                required: {
                                    message:
                                        EditUsernameValidationText.USERNAME
                                            .REQUIRED,
                                    value: EditUsernameValidationValues.USERNAME
                                        .REQUIRED,
                                },
                                validate: {
                                    noSpaces: (value: string) => {
                                        if (
                                            EditUsernameValidationValues.USERNAME.NO_SPACES.test(
                                                value,
                                            )
                                        ) {
                                            return true;
                                        }

                                        return EditUsernameValidationText
                                            .USERNAME.NO_SPACES;
                                    },
                                },
                            })}
                        />
                    </OverlayTrigger>
                    <label
                        className={styles.edit_username_form_label}
                        htmlFor="edit_username_form"
                    >
                        {"Username"}
                    </label>
                </Form.Floating>
            </Modal.Body>
        </Modal>
    );
};
