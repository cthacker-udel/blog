/* eslint-disable no-extra-boolean-cast -- disabled */
/* eslint-disable newline-per-chained-call -- disabled */
/* eslint-disable jest/require-hook -- disabled */
/* eslint-disable node/no-extraneous-import -- disabled */
/* eslint-disable import/no-named-as-default -- disabled */
/* eslint-disable import/no-extraneous-dependencies -- disabled (for now, after refresh delete) */

import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import Highlight from "@tiptap/extension-highlight";
import Placeholder from "@tiptap/extension-placeholder";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import css from "highlight.js/lib/languages/css";
import js from "highlight.js/lib/languages/javascript";
import ts from "highlight.js/lib/languages/typescript";
import html from "highlight.js/lib/languages/xml";
import { lowlight } from "lowlight";
import React from "react";
import { Button, Form, Modal, OverlayTrigger } from "react-bootstrap";
import type { OverlayInjectedProps } from "react-bootstrap/esm/Overlay";
import { toast } from "react-toastify";
import { Key } from "ts-key-enum";

import { PostService } from "@/api/service/post";
import { generateTooltip } from "@/common";

import styles from "./EditPostModal.module.css";

type EditPostModalProperties = {
    content: string | undefined;
    mutateContent: (_content: string) => Promise<void>;
    onHideEditPostModal: () => void;
    postId: string;
    showEditPostModal: boolean;
    title: string;
    updateTitle: (_updatedTitle: string) => void;
};

lowlight.registerLanguage("html", html);
lowlight.registerLanguage("css", css);
lowlight.registerLanguage("js", js);
lowlight.registerLanguage("ts", ts);

const editorToggleOffVariant = "outline-dark";
const editorToggleOnVariant = "dark";

/**
 *
 * @param param0
 * @returns
 */
export const EditPostModal = ({
    content,
    mutateContent,
    onHideEditPostModal,
    postId,
    showEditPostModal,
    title,
    updateTitle,
}: EditPostModalProperties): JSX.Element => {
    const [updatedTitle, setUpdatedTitle] = React.useState<string>(title);

    const editor = useEditor({
        content: content ?? "",
        editorProps: {
            attributes: {
                class: `${styles.post_editor} shadow-lg`,
            },
        },
        extensions: [
            StarterKit.configure({
                codeBlock: false,
            }),
            Placeholder,
            Underline,
            CodeBlockLowlight.configure({
                lowlight,
            }),
            Highlight.configure({ multicolor: true }),
            TextAlign.configure({
                alignments: ["left", "center", "right"],
                types: ["heading", "paragraph"],
            }),
        ],
    });

    const colorInputReference = React.createRef<HTMLInputElement>();

    const displayHighlightColorSelector = React.useCallback(() => {
        if (colorInputReference.current !== null) {
            colorInputReference.current.click();
        }
    }, [colorInputReference]);

    const closeModal = React.useCallback(() => {
        if (content !== undefined) {
            editor?.commands.setContent(content);
            onHideEditPostModal();
        }
    }, [content, editor?.commands, onHideEditPostModal]);

    const confirmEdit = React.useCallback(async (): Promise<void> => {
        if (editor !== null) {
            const htmlContent = editor?.getHTML();

            if (content === htmlContent && title === updatedTitle) {
                toast.error("No changes detected");
                return;
            }

            const updatingPostContent = toast.loading(
                "Updating post content...",
            );
            const { data: didUpdate } = await new PostService().updatePost(
                htmlContent,
                updatedTitle,
                postId,
            );
            if (didUpdate) {
                toast.update(updatingPostContent, {
                    autoClose: 1500,
                    isLoading: false,
                    render: "Successfully updated post content!",
                    type: "success",
                });
                await mutateContent(htmlContent);
                closeModal();
                editor.commands.setContent(htmlContent);
                if (title !== updatedTitle) {
                    updateTitle(updatedTitle);
                }
            } else {
                toast.update(updatingPostContent, {
                    autoClose: 1500,
                    isLoading: false,
                    render: "Failed to update post content",
                    type: "error",
                });
            }
        }
    }, [
        closeModal,
        content,
        editor,
        mutateContent,
        postId,
        title,
        updateTitle,
        updatedTitle,
    ]);

    const tabOverride = React.useCallback(
        (event: React.KeyboardEvent<HTMLDivElement>): void => {
            const { key } = event;
            if (key === Key.Tab) {
                editor?.commands.insertContent("      ");
                event.preventDefault();
            }
        },
        [editor?.commands],
    );

    if (!editor) {
        return <span />;
    }

    return (
        <>
            <Modal
                centered
                onHide={onHideEditPostModal}
                show={showEditPostModal}
                size="xl"
            >
                <Modal.Header className={styles.edit_post_modal_header}>
                    {"Edit"}
                    <Form.Control
                        onChange={(
                            event: React.ChangeEvent<HTMLInputElement>,
                        ): void => {
                            const { target } = event;
                            if (Boolean(target)) {
                                const { value } = target;
                                setUpdatedTitle(value);
                            }
                        }}
                        type="text"
                        value={updatedTitle}
                    />
                </Modal.Header>
                <Modal.Body>
                    <div className={styles.editor_toggles}>
                        <Button
                            onClick={(): void => {
                                editor.chain().focus().toggleCodeBlock().run();
                            }}
                            variant={
                                editor.isActive("codeBlock")
                                    ? editorToggleOnVariant
                                    : editorToggleOffVariant
                            }
                        >
                            <i className="fa-solid fa-code" />
                        </Button>
                        <Button
                            onClick={(): void => {
                                editor.chain().focus().toggleBold().run();
                            }}
                            variant={
                                editor.isActive("bold")
                                    ? editorToggleOnVariant
                                    : editorToggleOffVariant
                            }
                        >
                            <i className="fa-solid fa-bold" />
                        </Button>
                        <Button
                            onClick={(): void => {
                                editor.chain().focus().toggleItalic().run();
                            }}
                            variant={
                                editor.isActive("italic")
                                    ? editorToggleOnVariant
                                    : editorToggleOffVariant
                            }
                        >
                            <i className="fa-solid fa-italic" />
                        </Button>
                        <Button
                            onClick={(): void => {
                                editor.chain().focus().toggleUnderline().run();
                            }}
                            variant={
                                editor.isActive("underline")
                                    ? editorToggleOnVariant
                                    : editorToggleOffVariant
                            }
                        >
                            <i className="fa-solid fa-underline" />
                        </Button>
                        <Button
                            onClick={(): void => {
                                const isHighlightOn =
                                    editor.isActive("highlight");
                                if (isHighlightOn) {
                                    editor
                                        .chain()
                                        .focus()
                                        .unsetHighlight()
                                        .run();
                                } else {
                                    editor
                                        .chain()
                                        .focus()
                                        .toggleHighlight()
                                        .run();
                                    displayHighlightColorSelector();
                                }
                            }}
                            variant={
                                editor.isActive("highlight")
                                    ? editorToggleOnVariant
                                    : editorToggleOffVariant
                            }
                        >
                            <i className="fa-solid fa-highlighter" />
                        </Button>
                        <Button
                            onClick={(): void => {
                                editor
                                    .chain()
                                    .focus()
                                    .setTextAlign("left")
                                    .run();
                            }}
                            variant={
                                editor.isActive({ textAlign: "left" })
                                    ? editorToggleOnVariant
                                    : editorToggleOffVariant
                            }
                        >
                            <i className="fa-solid fa-align-left" />
                        </Button>
                        <Button
                            onClick={(): void => {
                                editor
                                    .chain()
                                    .focus()
                                    .setTextAlign("center")
                                    .run();
                            }}
                            variant={
                                editor.isActive({ textAlign: "center" })
                                    ? editorToggleOnVariant
                                    : editorToggleOffVariant
                            }
                        >
                            <i className="fa-solid fa-align-center" />
                        </Button>
                        <Button
                            onClick={(): void => {
                                editor
                                    .chain()
                                    .focus()
                                    .setTextAlign("right")
                                    .run();
                            }}
                            variant={
                                editor.isActive({ textAlign: "right" })
                                    ? editorToggleOnVariant
                                    : editorToggleOffVariant
                            }
                        >
                            <i className="fa-solid fa-align-right" />
                        </Button>
                    </div>
                    <div className={styles.post_editor_container}>
                        <EditorContent
                            editor={editor}
                            onKeyDown={tabOverride}
                        />
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <OverlayTrigger
                        overlay={(
                            properties: OverlayInjectedProps,
                        ): JSX.Element =>
                            generateTooltip({
                                content: "Cancel",
                                props: properties,
                            })
                        }
                    >
                        <Button
                            onClick={(): void => {
                                closeModal();
                            }}
                            tabIndex={-1}
                            variant="outline-secondary"
                        >
                            <i className="fa-solid fa-ban" />
                        </Button>
                    </OverlayTrigger>
                    <OverlayTrigger
                        overlay={(
                            properties: OverlayInjectedProps,
                        ): JSX.Element =>
                            generateTooltip({
                                content: "Confirm",
                                props: properties,
                            })
                        }
                        placement="bottom"
                    >
                        <Button
                            onClick={async (): Promise<void> => {
                                await confirmEdit();
                            }}
                            tabIndex={-1}
                            variant="outline-success"
                        >
                            <i className="fa-solid fa-check" />
                        </Button>
                    </OverlayTrigger>
                </Modal.Footer>
            </Modal>
            <input
                className={styles.color_input}
                onInput={(event: React.ChangeEvent<HTMLInputElement>): void => {
                    const { target } = event;
                    if (target !== undefined) {
                        const { value } = target;
                        editor
                            .chain()
                            .focus()
                            .setHighlight({
                                color: value,
                            })
                            .run();
                    }
                }}
                ref={colorInputReference}
                tabIndex={-1}
                type="color"
                value={"#00000f"}
            />
        </>
    );
};
