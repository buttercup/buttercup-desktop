import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import createRouter from "express-promise-router";
import { VERSION } from "../../library/build";
import { handleAuthPing, processAuthRequest, processAuthResponse } from "./controllers/auth";
import { searchEntries, searchSpecificEntries } from "./controllers/entries";
import { getAllOTPs } from "./controllers/otp";
import { getVaults, getVaultsTree, promptVaultLock, promptVaultUnlock } from "./controllers/vaults";
import { handleError } from "./error";
import { requireClient, requireKeyAuth } from "./middleware";
import { saveExistingEntry, saveNewEntry } from "./controllers/save";

export function buildApplication(): express.Application {
    const app = express();
    app.disable("x-powered-by");
    app.use(express.text());
    app.use(express.json());
    app.use(cors());
    app.use((req: Request, res: Response, next: NextFunction) => {
        res.set("Server", `ButtercupDesktop/${VERSION}`);
        next();
    });
    createRoutes(app);
    app.use(handleError);
    return app;
}

function createRoutes(app: express.Application): void {
    const router = createRouter();
    router.post("/auth/request", processAuthRequest);
    router.post("/auth/response", processAuthResponse);
    router.post("/auth/test", requireClient, requireKeyAuth, handleAuthPing);
    router.get("/entries", requireClient, searchEntries);
    router.post("/entries/specific", requireClient, requireKeyAuth, searchSpecificEntries);
    router.get("/otps", requireClient, getAllOTPs);
    router.get("/vaults", requireClient, getVaults);
    router.get("/vaults-tree", requireClient, getVaultsTree);
    router.patch(
        "/vaults/:id/group/:gid/entry/:eid",
        requireClient,
        requireKeyAuth,
        saveExistingEntry
    );
    router.post("/vaults/:id/group/:gid/entry", requireClient, requireKeyAuth, saveNewEntry);
    router.post("/vaults/:id/lock", requireClient, promptVaultLock);
    router.post("/vaults/:id/unlock", requireClient, promptVaultUnlock);
    app.use("/v1", router);
}
