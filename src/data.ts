import { kvGetRedirect, kvSaveRedirect } from "./kv"
import { getRedirect as dbGetRedirect, createRedirect as dbCreateRedirect } from "./db";

export const getRedirect = async (from: string): Promise<string | null> => {
    let to = await kvGetRedirect(from);
    if (!to) {
        to = await dbGetRedirect(from);
        if (!!to) {
            await kvSaveRedirect(from, to);
        }
    }
    return to;
}

export const createRedirect = async(from: string, to: string): Promise<boolean> => {
    const success = await dbCreateRedirect(from, to);
    if (success) {
        await kvSaveRedirect(from, to);
    }
    return success;
}