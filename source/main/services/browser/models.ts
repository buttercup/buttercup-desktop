import { z } from "zod";

const PUBLIC_KEY = z.string().regex(/^-----BEGIN PUBLIC KEY-----(\n|.)+-----END PUBLIC KEY-----$/m);
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

export const VaultUnlockParamSchema = z
    .object({
        id: z.string().min(1)
    })
    .strict();
