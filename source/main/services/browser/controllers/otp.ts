import { Request, Response } from "express";
import { getAllOTPs as getAllSourceOTPs } from "../../buttercup";
import { respondJSON } from "../response";

export async function getAllOTPs(req: Request, res: Response) {
    const otps = getAllSourceOTPs();
    await respondJSON(res, {
        otps
    });
}
