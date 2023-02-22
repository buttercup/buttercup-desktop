export * from "../shared/types";

export enum BrowserAPIErrorType {
    AuthMismatch = "err/auth/mismatch",
    NoAPIKey = "err/key/missing",
    NoAuthorization = "err/auth/missing"
}
