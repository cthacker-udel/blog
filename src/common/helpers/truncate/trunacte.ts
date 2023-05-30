/* eslint-disable no-confusing-arrow -- disabled */
/**
 * Truncates the text to the specified length (25 by default) and returns the text starting from
 * the beginning up to the text length + ellipsis
 *
 * @param text - The text to truncate
 * @param textLength - The length of the truncated string (25 by default)
 * @returns The truncated text
 */
export const truncate = (text: string, textLength = 100): string =>
    text.length > textLength + 3 ? `${text.slice(0, textLength)}...` : text;
