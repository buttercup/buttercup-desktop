import { z } from "zod";

export const AuthRequestSchema = z.object({
    client: z.literal("browser"),
    purpose: z.literal("vaults-access"),
    rev: z.literal(1)
});

export const AuthResponseSchema = z.object({
    code: z.string().min(1)
});

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
