/* eslint-disable newline-per-chained-call -- disabled */
/* eslint-disable jest/require-hook -- disabled */
/* eslint-disable node/no-extraneous-import -- disabled */
/* eslint-disable import/no-named-as-default -- disabled */
/* eslint-disable import/no-extraneous-dependencies -- disabled (for now, after refresh delete) */
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import Highlight from "@tiptap/extension-highlight";
import Placeholder from "@tiptap/extension-placeholder";
import Underline from "@tiptap/extension-underline";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import css from "highlight.js/lib/languages/css";
import js from "highlight.js/lib/languages/javascript";
import ts from "highlight.js/lib/languages/typescript";
import html from "highlight.js/lib/languages/xml";
import { lowlight } from "lowlight";
import React from "react";
import { Button, Modal } from "react-bootstrap";

import styles from "./EditPostModal.module.css";

type EditPostModalProperties = {
    content: string | undefined;
    onHideEditPostModal: () => void;
    postId: string;
    showEditPostModal: boolean;
    title: string;
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
    onHideEditPostModal,
    postId,
    showEditPostModal,
    title,
}: EditPostModalProperties): JSX.Element => {
    const editor = useEditor({
        content: content ?? "",
        extensions: [
            StarterKit,
            Placeholder,
            Underline,
            CodeBlockLowlight.configure({ lowlight }),
            Highlight.configure({ multicolor: true }),
        ],
    });

    const colorInputReference = React.createRef<HTMLInputElement>();

    const displayHighlightColorSelector = React.useCallback(() => {
        if (colorInputReference.current !== null) {
            colorInputReference.current.click();
        }
    }, [colorInputReference]);

    if (!editor) {
        return <span />;
    }

    return (
        <>
            <Modal onHide={onHideEditPostModal} show={showEditPostModal}>
                <Modal.Header>{`Edit ${title}`}</Modal.Header>
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
                    </div>
                    <EditorContent editor={editor} />
                </Modal.Body>
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
