import { z } from "zod";

export enum EntriesSearchType {
    Term = "term",
    URL = "url"
}

export const EntriesSearchPayloadSchema = z.discriminatedUnion("type", [
    z.object({
        term: z.string(),
        type: z.literal(EntriesSearchType.Term)
    }),
    z.object({
        type: z.literal(EntriesSearchType.URL),
        url: z.string().url()
    })
]);
