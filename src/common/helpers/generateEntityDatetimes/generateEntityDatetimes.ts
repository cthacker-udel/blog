type Datetimes = {
    createdAt: Date;
    updatedAt: Date;
};

/**
 * Generates the common date times required by entities
 *
 * @returns The common datetimes required by most entities
 */
export const generateEntityDateTimes = (): Datetimes => ({
    createdAt: new Date(Date.now()),
    updatedAt: new Date(Date.now()),
});
