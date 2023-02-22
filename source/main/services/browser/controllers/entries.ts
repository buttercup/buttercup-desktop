import { Request, Response } from "express";
import { SearchResult } from "buttercup";
import { EntriesSearchPayloadSchema, EntriesSearchType } from "../models";

export async function searchEntries(req: Request, res: Response) {
    const config = EntriesSearchPayloadSchema.parse(req.body);
    let results: Array<SearchResult> = [];
    if (config.type === EntriesSearchType.Term) {
    } else if (config.type === EntriesSearchType.URL) {
    }
    res.json({
        results
    });
}
