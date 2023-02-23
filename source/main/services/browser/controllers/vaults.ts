import { Request, Response } from "express";
import { getSourceDescriptions } from "../../buttercup";

export async function getVaults(req: Request, res: Response) {
    const sources = getSourceDescriptions();
    res.json({
        sources
    });
}
