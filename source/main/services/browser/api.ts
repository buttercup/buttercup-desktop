import express, { Request, Response, NextFunction } from "express";
import createRouter from "express-promise-router";
import { VERSION } from "../../library/build";
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
    return app;
}

function createRoutes(app: express.Application): void {
    const router = createRouter();
    router.post("/auth/request", () => {});
    router.get("/vaults", requireBrowserToken, () => {});
    app.use("/v1", router);
}
