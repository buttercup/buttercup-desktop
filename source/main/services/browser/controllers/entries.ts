import { Request, Response } from "express";
import { PropertyKeyValueObject, SearchResult, getEntryURLs } from "buttercup";
import { EntriesSearchBodySchema, EntriesSearchQuerySchema, EntriesSearchType } from "../models";
import { searchAllVaultsByTerm, searchAllVaultsByURL } from "../../search";
import { respondJSON } from "../response";
import { getEntries } from "../../buttercup";

export async function searchEntries(req: Request, res: Response) {
    const config = EntriesSearchQuerySchema.parse(req.query);
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

export async function searchSpecificEntries(req: Request, res: Response) {
    const { entries } = EntriesSearchBodySchema.parse(req.body);
    const resultItems = await getEntries(entries as Array<{ entryID: string; sourceID: string }>);
    const results: Array<SearchResult> = resultItems.map((item) => ({
        entryType: item.entry.getType(),
        groupID: item.entry.getGroup().id,
        id: item.entry.id,
        properties: item.entry.getProperty() as PropertyKeyValueObject,
        tags: item.entry.getTags(),
        sourceID: item.sourceID,
        urls: getEntryURLs(item.entry.getProperty() as PropertyKeyValueObject),
        vaultID: item.entry.vault.id
    }));
    await respondJSON(res, {
        results
    });
}
