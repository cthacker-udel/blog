import React from "react";
import { Button, Form, OverlayTrigger } from "react-bootstrap";
import type { OverlayInjectedProps } from "react-bootstrap/esm/Overlay";
import { useForm, useWatch } from "react-hook-form";

import {
    generatePopover,
    generateTooltip,
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

    const { control, register } = useForm<FormValues>({
        criteriaMode: "all",
        defaultValues: FORM_DEFAULT_VALUES,
        delayError: 100,
        mode: "all",
        reValidateMode: "onChange",
    });

    const password = useWatch({ control, name: "password" });

    return (
        <>
            <div className={styles.signup_title}>{"Sign Up"}</div>
            <div className={styles.signup_form}>
                <Form.Floating>
                    <Form.Control
                        id="username_form"
                        placeholder="Username"
                        type="text"
                        {...register("username", {
                            maxLength: {
                                message:
                                    SignUpValidationText.USERNAME.MAX_LENGTH,
                                value: SignUpValidationValues.USERNAME
                                    .MAX_LENGTH,
                            },
                            required: {
                                message: SignUpValidationText.USERNAME.REQUIRED,
                                value: SignUpValidationValues.USERNAME.REQUIRED,
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
                    <label htmlFor="username_form">{"Username"}</label>
                </Form.Floating>
                <Form.Floating>
                    <OverlayTrigger
                        overlay={(
                            properties: OverlayInjectedProps,
                        ): JSX.Element =>
                            generatePopover(
                                properties,
                                <PasswordLayout password={password} />,
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
                <Button variant="outline-primary">{"Sign Up"}</Button>
            </div>
        </>
    );
};
