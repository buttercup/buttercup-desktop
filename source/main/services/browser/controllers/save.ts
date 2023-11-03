import { Request, Response } from "express";
import {
    SaveExistingEntryParamSchema,
    SaveExistingEntryPayloadSchema,
    SaveNewEntryParamSchema,
    SaveNewEntryPayloadSchema
} from "../models";
import { logInfo } from "../../../library/log";
import { createNewEntry, updateExistingEntry } from "../../buttercup";

export async function saveExistingEntry(req: Request, res: Response) {
    const { eid: entryID, id: sourceID } = SaveExistingEntryParamSchema.parse(req.params);
    const { properties } = SaveExistingEntryPayloadSchema.parse(req.body);
    // Update entry
    logInfo(`(api) update existing entry: ${entryID} (source=${sourceID})`);
    await updateExistingEntry(sourceID, entryID, properties);
    // Respond
    res.json({
        entryID
    });
}

export async function saveNewEntry(req: Request, res: Response) {
    const { gid: groupID, id: sourceID } = SaveNewEntryParamSchema.parse(req.params);
    const { properties, type } = SaveNewEntryPayloadSchema.parse(req.body);
    // Create entry
    logInfo(`(api) create new entry (source=${sourceID}, group=${groupID})`);
    const entryID = await createNewEntry(sourceID, groupID, type, properties);
    // Respond
    res.json({
        entryID
    });
}
