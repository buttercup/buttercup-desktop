import { Request, Response } from "express";
import { promptUserForBrowserAccess } from "../interaction";
import { AuthRequestSchema } from "../models";

export async function processAuthRequest(req: Request, res: Response) {
    AuthRequestSchema.parse(req.body);
    await promptUserForBrowserAccess();
    res.send("OK");
}
