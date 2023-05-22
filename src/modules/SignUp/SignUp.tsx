/* eslint-disable @typescript-eslint/no-floating-promises -- disabled */
import { useRouter } from "next/router";
import React from "react";
import { Button, Form, OverlayTrigger } from "react-bootstrap";
import type { OverlayInjectedProps } from "react-bootstrap/esm/Overlay";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "react-toastify";
import { Key } from "ts-key-enum";

import { UserService } from "@/api/service";
import {
    generatePopover,
    SignUpValidationText,
    SignUpValidationValues,
} from "@/common";
import { useBackground, useLayoutInjector } from "@/hooks";

import { PasswordLayout } from "./PasswordLayout";
import styles from "./SignUp.module.css";

type FormValues = {
    password: string;
    username: string;
};

const FORM_DEFAULT_VALUES: FormValues = {
    password: "",
    username: "",
};

/**
 * Signs a user up for the application
 *
 * @returns The signup form, which is used to sign a user up for the application
 */
export const SignUp = (): JSX.Element => {
    useBackground({
        imageConfig: {
            background:
                "linear-gradient(0deg, rgba(43,195,34,1) 0%, rgba(45,66,253,1) 100%)",
        },
    });

    useLayoutInjector(styles.signup_layout);

    const { control, formState, getValues, register } = useForm<FormValues>({
        criteriaMode: "all",
        defaultValues: FORM_DEFAULT_VALUES,
        delayError: 100,
        mode: "all",
        reValidateMode: "onChange",
    });

    const passwordWatchValue = useWatch({ control, name: "password" });

    const { dirtyFields, errors, isDirty, isValidating } = formState;

    const router = useRouter();

    const [isPasswordValid, setIsPasswordValid] =
        React.useState<boolean>(false);

    const updatePasswordValidity = React.useCallback((value: boolean) => {
        setIsPasswordValid(value);
    }, []);

    const signUp = React.useCallback(async () => {
        if (
            isPasswordValid &&
            Object.keys(errors).length === 0 &&
            Object.keys(dirtyFields).length === 2 &&
            isDirty
        ) {
            const { password, username } = getValues();
            const signingUpToast = toast.loading("Signing up...");
            const { data } = await new UserService().signUp(username, password);
            if (data) {
                toast.update(signingUpToast, {
                    autoClose: 1500,
                    isLoading: false,
                    render: "Successfully signed up!",
                    type: "success",
                });
                router.push("/dashboard");
            } else {
                toast.update(signingUpToast, {
                    autoClose: 1500,
                    isLoading: false,
                    render: "Failed to sign up",
                    type: "error",
                });
            }
        }
    }, [dirtyFields, errors, isDirty, getValues, isPasswordValid, router]);

    return (
        <>
            <div className={styles.signup_title}>{"Sign Up"}</div>
            <div
                className={styles.signup_form}
                onKeyDown={async (
                    event: React.KeyboardEvent<HTMLDivElement>,
                ): Promise<void> => {
                    const { key } = event;
                    if (key === Key.Enter) {
                        await signUp();
                    }
                }}
                tabIndex={-1}
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
                            id="username_form"
                            placeholder="Username"
                            type="text"
                            {...register("username", {
                                maxLength: {
                                    message:
                                        SignUpValidationText.USERNAME
                                            .MAX_LENGTH,
                                    value: SignUpValidationValues.USERNAME
                                        .MAX_LENGTH,
                                },
                                required: {
                                    message:
                                        SignUpValidationText.USERNAME.REQUIRED,
                                    value: SignUpValidationValues.USERNAME
                                        .REQUIRED,
                                },
                                validate: {
                                    noSpaces: (value: string) => {
                                        if (
                                            SignUpValidationValues.USERNAME.NO_SPACES.test(
                                                value,
                                            )
                                        ) {
                                            return true;
                                        }

                                        return SignUpValidationText.USERNAME
                                            .NO_SPACES;
                                    },
                                },
                            })}
                        />
                    </OverlayTrigger>
                    <label htmlFor="username_form">{"Username"}</label>
                </Form.Floating>
                <Form.Floating
                    onMouseLeave={(): void => {
                        const passwordForm =
                            document.querySelector("#password_form");
                        if (passwordForm !== null) {
                            (passwordForm as HTMLFormElement).blur();
                        }
                    }}
                >
                    <OverlayTrigger
                        overlay={(
                            properties: OverlayInjectedProps,
                        ): JSX.Element =>
                            generatePopover(
                                properties,
                                <PasswordLayout
                                    password={passwordWatchValue}
                                    updatePasswordValidity={
                                        updatePasswordValidity
                                    }
                                />,
                                "Password Requirements",
                                {
                                    popoverClassNameOverride:
                                        styles.password_requirement_popover,
                                    popoverHeaderClassNameOverride:
                                        styles.password_requirement_popover_header,
                                },
                            )
                        }
                        placement="right"
                    >
                        <Form.Control
                            id="password_form"
                            placeholder="Password"
                            type="password"
                            {...register("password")}
                        />
                    </OverlayTrigger>
                    <label htmlFor="password_form">{"Password"}</label>
                </Form.Floating>
                <Button
                    disabled={
                        errors.username !== undefined ||
                        !isPasswordValid ||
                        isValidating
                    }
                    onClick={async (): Promise<void> => {
                        await signUp();
                    }}
                    variant="primary"
                >
                    {"Sign Up"}
                </Button>
            </div>
        </>
    );
};
