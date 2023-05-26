import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import React from "react";
import { Modal } from "react-bootstrap";

type EditPostModalProperties = {
    content: string | undefined;
    onHideEditPostModal: () => void;
    postId: string;
    showEditPostModal: boolean;
    title: string;
};

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
        extensions: [StarterKit],
    });

    return (
        <Modal onHide={onHideEditPostModal} show={showEditPostModal}>
            <Modal.Header>{`Edit ${title}`}</Modal.Header>
            <Modal.Body>
                <EditorContent editor={editor} />
            </Modal.Body>
        </Modal>
    );
};
