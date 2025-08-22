import logger from "./logger";

export function delay(ms: number): Promise<void> {
    logger.debug(`Delaying for ${ms}ms...`);
    return new Promise(resolve => setTimeout(resolve, ms));
}