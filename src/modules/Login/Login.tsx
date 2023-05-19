import React from "react";
import { Button, Form, InputGroup } from "react-bootstrap";
import { useForm } from "react-hook-form";

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

    const { formState, register } = useForm<LoginFormValues>({
        criteriaMode: "all",
        defaultValues: LOGIN_FORM_DEFAULT_VALUES,
        delayError: 200,
        mode: "all",
        reValidateMode: "onChange",
    });

    const { dirtyFields, isDirty, isValidating } = formState;

    return (
        <>
            <div className={`${styles.login_title}`} id="login_title">
                {"Login"}
            </div>
            <div className={styles.login_form}>
                <Form.Group controlId="username">
                    <Form.Label className={styles.login_form_label}>
                        {"Username"}
                    </Form.Label>
                    <InputGroup>
                        <Form.Control type="text" {...register("username")} />
                        <InputGroup.Text>
                            <i className="fa-solid fa-user text-dark" />
                        </InputGroup.Text>
                    </InputGroup>
                </Form.Group>
                <Form.Group controlId="password">
                    <Form.Label className={styles.login_form_label}>
                        {"Password"}
                    </Form.Label>
                    <InputGroup>
                        <Form.Control
                            type="password"
                            {...register("password")}
                        />
                        <InputGroup.Text>
                            <i className="fa-solid fa-key text-dark" />
                        </InputGroup.Text>
                    </InputGroup>
                </Form.Group>
            </div>
            <Button
                variant={
                    isDirty &&
                    !isValidating &&
                    dirtyFields.username &&
                    dirtyFields.password
                        ? "success"
                        : "outline-secondary"
                }
            >
                {"Login"}
            </Button>
        </>
    );
};
