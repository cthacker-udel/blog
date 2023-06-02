/* eslint-disable @typescript-eslint/no-floating-promises -- id*/
import { useRouter } from "next/router";
import React from "react";
import { Form, Modal, OverlayTrigger } from "react-bootstrap";
import type { OverlayInjectedProps } from "react-bootstrap/esm/Overlay";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { Key } from "ts-key-enum";

import { UserService } from "@/api/service";
import {
    AddPostValidationText,
    AddPostValidationValues,
    generatePopover,
} from "@/common";

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
 * The modal used for adding a post both to the database and to the application as a whole
 *
 * @param props - The properties of the AddPostModal component
 * @param props.onHide - The callback that is fired when the modal is hiding
 * @param props.showAddPostModal - The boolean that controls whether the modal is shown
 *
 * @returns - The modal used for adding a post to the blog
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

    const addPost = React.useCallback(async () => {
        if (
            dirtyFields.title &&
            errors.title === undefined &&
            isDirty &&
            !isValidating
        ) {
            const addingPostToast = toast.loading("Adding post...");
            const { title } = getValues();
            const { data } = await new UserService().addPost(title);
            if (data === null) {
                toast.update(addingPostToast, {
                    autoClose: 1500,
                    isLoading: false,
                    render: "Failed to add post",
                    type: "error",
                });
            } else {
                toast.update(addingPostToast, {
                    autoClose: 1500,
                    isLoading: false,
                    render: "Successfully added post!",
                    type: "success",
                });
                router.push(`post/${data.toString()}`);
            }
        }
    }, [dirtyFields, errors, getValues, isDirty, isValidating, router]);

    const onClose = React.useCallback(() => {
        clearErrors();
        reset();
        onHide();
    }, [clearErrors, onHide, reset]);

    return (
        <Modal
            contentClassName={styles.edit_post_title_modal_content}
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
                        await addPost();
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
                                            styles.post_title_popover_header
                                        }
                                    >
                                        <i
                                            className={`fa-solid fa-circle-check fa-beat ${styles.post_title_success_icon}`}
                                        />
                                        <span
                                            className={
                                                styles.post_title_error_header_text
                                            }
                                        >
                                            {"Title is valid!"}
                                        </span>
                                        <i
                                            className={`fa-solid fa-circle-check fa-beat ${styles.post_title_success_icon}`}
                                        />
                                    </div>
                                ) : (
                                    <div
                                        className={
                                            styles.post_title_popover_header
                                        }
                                    >
                                        <i
                                            className={`fa-solid fa-circle-exclamation fa-spin ${styles.post_title_error_icon}`}
                                        />
                                        <span
                                            className={
                                                styles.post_title_error_header_text
                                            }
                                        >
                                            {"Title Error"}
                                        </span>
                                        <i
                                            className={`fa-solid fa-circle-exclamation fa-spin ${styles.post_title_error_icon}`}
                                        />
                                    </div>
                                ),
                                {
                                    popoverBodyClassNameOverride:
                                        styles.post_title_popover_body,
                                    popoverClassNameOverride: `${
                                        styles.post_title_popover
                                    } ${
                                        errors.title === undefined
                                            ? styles.post_title_popover_success
                                            : styles.post_title_popover_error
                                    }`,
                                    popoverHeaderClassNameOverride:
                                        styles.post_title_error_popover_header,
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
                            className={styles.edit_post_title_form}
                            id="edit_post_title_form"
                            placeholder="Post Title"
                            type="text"
                            {...register("title", {
                                maxLength: {
                                    message:
                                        AddPostValidationText.TITLE.MAX_LENGTH,
                                    value: AddPostValidationValues.TITLE
                                        .MAX_LENGTH,
                                },
                                required: {
                                    message:
                                        AddPostValidationText.TITLE.REQUIRED,
                                    value: AddPostValidationValues.TITLE
                                        .REQUIRED,
                                },
                            })}
                        />
                    </OverlayTrigger>
                    <label
                        className={styles.edit_post_title_form_label}
                        htmlFor="edit_post_title_form"
                    >
                        {"Post Title"}
                    </label>
                </Form.Floating>
            </Modal.Body>
        </Modal>
    );
};
