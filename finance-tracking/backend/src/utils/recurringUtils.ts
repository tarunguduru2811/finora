
export function getBudgetPeriodDates(period: string, referenceDate: Date = new Date()) {
    let startDate: Date;
    let endDate: Date;

    switch (period.toUpperCase()) {
        case "DAILY":
            startDate = new Date(referenceDate);
            startDate.setHours(0, 0, 0, 0);
            endDate = new Date(referenceDate);
            endDate.setHours(23, 59, 59, 999);
            break;
        case "WEEKLY":
            const day = referenceDate.getDay(); // 0 = Sunday
            startDate = new Date(referenceDate);
            startDate.setDate(referenceDate.getDate() - day);
            startDate.setHours(0, 0, 0, 0);
            endDate = new Date(startDate);
            endDate.setDate(startDate.getDate() + 6);
            endDate.setHours(23, 59, 59, 999);
            break;
        case "MONTHLY":
            startDate = new Date(referenceDate.getFullYear(), referenceDate.getMonth(), 1);
            endDate = new Date(referenceDate.getFullYear(), referenceDate.getMonth() + 1, 0, 23, 59, 59, 999);
            break;
        case "YEARLY":
            startDate = new Date(referenceDate.getFullYear(), 0, 1);
            endDate = new Date(referenceDate.getFullYear(), 11, 31, 23, 59, 59, 999);
            break;
        default:
            throw new Error(`Unsupported period: ${period}`);
    }

    return { startDate, endDate };
}
