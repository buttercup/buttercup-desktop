import { Request, Response } from "express";
import { SearchResult } from "buttercup";
import { EntriesSearchPayloadSchema, EntriesSearchType } from "../models";
import { searchAllVaultsByTerm, searchAllVaultsByURL } from "../../search";
import { respondJSON } from "../response";

export async function searchEntries(req: Request, res: Response) {
    const config = EntriesSearchPayloadSchema.parse(req.query);
    let results: Array<SearchResult> = [];
    if (config.type === EntriesSearchType.Term) {
        results = await searchAllVaultsByTerm(config.term);
    } else if (config.type === EntriesSearchType.URL) {
        results = await searchAllVaultsByURL(config.url);
    }
    await respondJSON(res, {
        results
    });
}
