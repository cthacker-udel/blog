/* eslint-disable @typescript-eslint/no-floating-promises -- disabled */
import { useRouter } from "next/router";
import React from "react";
import { Form, Modal, OverlayTrigger } from "react-bootstrap";
import type { OverlayInjectedProps } from "react-bootstrap/esm/Overlay";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { Key } from "ts-key-enum";

import { UserService } from "@/api/service";
import {
    EditUsernameValidationText,
    EditUsernameValidationValues,
    generatePopover,
} from "@/common";

import styles from "./EditUsername.module.css";

type EditUsernameModalProperties = {
    onHide: () => void;
    showEditUsernameModal: boolean;
};

type FormValues = {
    username: string;
};

const EDIT_USERNAME_FORM_DEFAULT_VALUES: FormValues = {
    username: "",
};

/**
 *
 * @param props - The properties of the Edit Username Modal component
 */
export const EditUsernameModal = ({
    showEditUsernameModal,
    onHide,
}: EditUsernameModalProperties): JSX.Element => {
    const { formState, getValues, register } = useForm<FormValues>({
        criteriaMode: "all",
        defaultValues: EDIT_USERNAME_FORM_DEFAULT_VALUES,
        delayError: 100,
        mode: "all",
        reValidateMode: "onChange",
    });

    const { dirtyFields, errors, isDirty, isValidating } = formState;

    const router = useRouter();

    const editUsername = React.useCallback(async () => {
        if (
            dirtyFields.username !== undefined &&
            errors.username !== undefined &&
            isDirty &&
            !isValidating
        ) {
            const editingUsernameToast = toast.loading("Editing username...");
            const { username } = getValues();
            const { data } = await new UserService().editUsername(username);
            if (data ?? false) {
                toast.update(editingUsernameToast, {
                    autoClose: 1500,
                    isLoading: false,
                    render: "Successfully edited username!",
                    type: "success",
                });
                await new UserService().logout();
                router.push("/");
            } else {
                toast.update(editingUsernameToast, {
                    autoClose: 1500,
                    isLoading: false,
                    render: "Failed to edit username",
                    type: "error",
                });
            }
        }
    }, [
        dirtyFields.username,
        errors.username,
        getValues,
        isDirty,
        isValidating,
        router,
    ]);

    return (
        <Modal onHide={onHide} show={showEditUsernameModal}>
            <Modal.Header closeButton closeVariant="white">
                {"Edit Username"}
            </Modal.Header>
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
                                errors.username?.message,
                                <div className={styles.username_error_header}>
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
                                </div>,
                                {
                                    popoverClassNameOverride:
                                        styles.username_popover,
                                    popoverHeaderClassNameOverride:
                                        styles.username_error_popover_header,
                                },
                            )
                        }
                        placement="left"
                        show={errors.username !== undefined}
                    >
                        <Form.Control
                            autoComplete="off"
                            id="edit_username_form"
                            placeholder="Username"
                            type="text"
                            {...register("username", {
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
                </Form.Floating>
            </Modal.Body>
        </Modal>
    );
};
