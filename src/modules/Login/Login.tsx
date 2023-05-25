/* eslint-disable @typescript-eslint/no-floating-promises -- disabled */
import Head from "next/head";
import { useRouter } from "next/router";
import React from "react";
import { Button, Form, InputGroup, OverlayTrigger } from "react-bootstrap";
import type { OverlayInjectedProps } from "react-bootstrap/esm/Overlay";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { Key } from "ts-key-enum";

import { UserService } from "@/api/service";
import { generateTooltip } from "@/common";
import { useBackground, useLayoutInjector } from "@/hooks";

import styles from "./Login.module.css";

type LoginFormValues = {
    password: string;
    username: string;
};

const LOGIN_FORM_DEFAULT_VALUES: LoginFormValues = {
    password: "",
    username: "",
};

/**
 *
 * @returns
 */
export const Login = (): JSX.Element => {
    useBackground({
        imageConfig: {
            background:
                "linear-gradient(0deg, rgba(34,193,195,1) 0%, rgba(45,84,253,1) 100%)",
        },
    });

    useLayoutInjector(styles.login_layout);

    const router = useRouter();

    const { formState, getValues, register } = useForm<LoginFormValues>({
        criteriaMode: "all",
        defaultValues: LOGIN_FORM_DEFAULT_VALUES,
        delayError: 200,
        mode: "all",
        reValidateMode: "onChange",
    });

    const { dirtyFields, errors, isDirty, isValidating } = formState;

    const login = React.useCallback(async (): Promise<void> => {
        if (
            isDirty &&
            Object.keys(dirtyFields).length === 2 &&
            Object.keys(errors).length === 0
        ) {
            const { password, username } = getValues();
            const loggingInToast = toast.loading("Logging in");
            const { data } = await new UserService().login(username, password);
            if (data) {
                toast.update(loggingInToast, {
                    autoClose: 1500,
                    isLoading: false,
                    render: "Successfully logged in!",
                    type: "success",
                });
                router.push("/dashboard");
            } else {
                toast.update(loggingInToast, {
                    autoClose: 1500,
                    isLoading: false,
                    render: "Failed to login",
                    type: "error",
                });
            }
        }
    }, [dirtyFields, errors, isDirty, getValues, router]);

    return (
        <>
            <Head>
                <title>{"Login"}</title>
            </Head>
            <div className={`${styles.login_title}`} id="login_title">
                {"Login"}
                <OverlayTrigger
                    delay={{ hide: 100, show: 200 }}
                    overlay={(properties: OverlayInjectedProps): JSX.Element =>
                        generateTooltip({
                            content: "Home Page",
                            props: properties,
                        })
                    }
                    placement="right"
                >
                    <i
                        className={`fa-solid fa-house fa-xs ${styles.login_title_icon}`}
                        onClick={(): void => {
                            router.push("/");
                        }}
                    />
                </OverlayTrigger>
            </div>
            <div
                className={styles.login_form}
                id="login_form"
                onKeyDown={async (
                    event: React.KeyboardEvent<HTMLDivElement>,
                ): Promise<void> => {
                    const { key } = event;
                    if (
                        key === Key.Enter &&
                        isDirty &&
                        Object.keys(dirtyFields).length === 2
                    ) {
                        await login();
                    }
                }}
                tabIndex={0}
            >
                <Form.Group>
                    <Form.Label className={styles.login_form_label}>
                        {"Username"}
                    </Form.Label>
                    <InputGroup>
                        <Form.Floating>
                            <Form.Control
                                autoComplete="off"
                                autoCorrect="off"
                                className={styles.login_form_control}
                                id="login_form_username"
                                placeholder="Enter your username"
                                tabIndex={0}
                                type="text"
                                {...register("username")}
                            />
                            <label
                                className={styles.login_form_floating_control}
                                htmlFor="login_form_username"
                            >
                                {"Username"}
                            </label>
                        </Form.Floating>
                        <InputGroup.Text
                            className={styles.login_form_control_icon}
                        >
                            <i className="fa-solid fa-user" />
                        </InputGroup.Text>
                    </InputGroup>
                </Form.Group>
                <Form.Group>
                    <Form.Label className={styles.login_form_label}>
                        {"Password"}
                    </Form.Label>
                    <InputGroup tabIndex={1}>
                        <Form.Floating>
                            <Form.Control
                                autoComplete="off"
                                autoCorrect="off"
                                className={styles.login_form_control}
                                id="login_password_form"
                                placeholder="Enter your password"
                                tabIndex={0}
                                type="password"
                                {...register("password")}
                            />
                            <label
                                className={styles.login_form_floating_control}
                                htmlFor="login_password_form"
                            >
                                {"Password"}
                            </label>
                        </Form.Floating>
                        <InputGroup.Text
                            className={styles.login_form_control_icon}
                        >
                            <i className="fa-solid fa-key" />
                        </InputGroup.Text>
                    </InputGroup>
                </Form.Group>
            </div>
            <Button
                disabled={
                    !isDirty ||
                    isValidating ||
                    !dirtyFields.username ||
                    !dirtyFields.password
                }
                onClick={async (): Promise<void> => {
                    await login();
                }}
                tabIndex={0}
                variant={
                    isDirty &&
                    !isValidating &&
                    dirtyFields.username &&
                    dirtyFields.password
                        ? "outline-success"
                        : "outline-primary"
                }
            >
                {"Login"}
            </Button>
        </>
    );
};
