import type { Comment } from "./Comment";

export type CommentWithUsername = Comment & { username: string };
