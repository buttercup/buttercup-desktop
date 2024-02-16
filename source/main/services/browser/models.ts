import { EntryType } from "buttercup";
import { z } from "zod";

const PUBLIC_KEY = z.string();
const ULID = z.string().regex(/^[a-z0-9]{26}$/i);

export const AuthRequestSchema = z.object({
    client: z.literal("browser"),
    purpose: z.literal("vaults-access"),
    rev: z.literal(1)
});

export const AuthResponseSchema = z.object({
    code: z.string().min(1),
    id: ULID,
    publicKey: PUBLIC_KEY
});

export enum EntriesSearchType {
    Term = "term",
    URL = "url"
}

export const EntriesSearchBodySchema = z.object({
    entries: z.array(
        z.object({
            entryID: z.string().min(1),
            sourceID: z.string().min(1)
        })
    )
});

export const EntriesSearchQuerySchema = z.discriminatedUnion("type", [
    z.object({
        term: z.string(),
        type: z.literal(EntriesSearchType.Term)
    }),
    z.object({
        type: z.literal(EntriesSearchType.URL),
        url: z.string().url()
    })
]);

export const SaveExistingEntryParamSchema = z
    .object({
        eid: z.string().min(1),
        gid: z.string().min(1), // not explicitly used
        id: z.string().min(1)
    })
    .strict();

export const SaveExistingEntryPayloadSchema = z.object({
    properties: z.record(z.string())
});

export const SaveNewEntryParamSchema = z
    .object({
        gid: z.string().min(1),
        id: z.string().min(1)
    })
    .strict();

export const SaveNewEntryPayloadSchema = z.object({
    properties: z.record(z.string()),
    type: z.nativeEnum(EntryType)
});

export const VaultUnlockParamSchema = z
    .object({
        id: z.string().min(1)
    })
    .strict();
