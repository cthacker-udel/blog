/* eslint-disable @typescript-eslint/indent -- disabled */
import React from "react";

import { UserRoles } from "@/common";

import styles from "./UserInfo.module.css";

type UserInfoProperties = {
    createdAt: string;
    role: UserRoles;
    username: string;
};

/**
 * Displays the user's information
 *
 * @param props - The properties of the user information display
 * @param props.createdAt - When the user joined the blog
 * @param props.role - What role the user has (user, admin, super admin)
 * @param props.username - The username of the currently logged in user
 * @returns The user information displayed in a popover
 */
export const UserInfo = ({
    createdAt,
    role,
    username,
}: UserInfoProperties): JSX.Element => (
    <div className={styles.user_info_display}>
        <div className={styles.user_info_section}>
            <div className={styles.user_info_label}>
                <i
                    className={`fa-solid fa-user-plus ${styles.user_info_label_icon}`}
                />
            </div>
            <div className={styles.user_info_info}>
                {new Date(createdAt).toDateString()}
            </div>
        </div>
        <div className={styles.user_info_section}>
            <div className={styles.user_info_label}>
                <i
                    className={`fa-solid fa-id-badge ${styles.user_info_label_icon}`}
                />
            </div>
            <div className={styles.user_info_info}>
                {role === UserRoles.USER
                    ? "User"
                    : role === UserRoles.ADMIN
                    ? "Admin"
                    : "Super Admin"}
            </div>
        </div>
        <div className={styles.user_info_section}>
            <div className={styles.user_info_label}>
                <i
                    className={`fa-solid fa-signature ${styles.user_info_label_icon}`}
                />
            </div>
            <div className={styles.user_info_info}>{username}</div>
        </div>
    </div>
);
