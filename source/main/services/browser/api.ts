import express, { Request, Response, NextFunction } from "express";
import createRouter from "express-promise-router";
import { VERSION } from "../../library/build";
import { handleAuthPing, processAuthRequest, processAuthResponse } from "./controllers/auth";
import { searchEntries } from "./controllers/entries";
import { getAllOTPs } from "./controllers/otp";
import { getVaults } from "./controllers/vaults";
import { promptVaultUnlock } from "./controllers/unlock";
import { handleError } from "./error";
import { requireBrowserToken } from "./middleware";

export function buildApplication(): express.Application {
    const app = express();
    // app.enable("trust proxy");
    app.disable("x-powered-by");
    app.use(express.json());
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
    router.post("/auth/test", requireBrowserToken, handleAuthPing);
    router.get("/entries", requireBrowserToken, searchEntries);
    router.get("/otps", requireBrowserToken, getAllOTPs);
    router.get("/vaults", requireBrowserToken, getVaults);
    router.post("/vaults/:id/lock", requireBrowserToken, () => {});
    router.post("/vaults/:id/unlock", requireBrowserToken, promptVaultUnlock);
    app.use("/v1", router);
}
