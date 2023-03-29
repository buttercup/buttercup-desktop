import { Request, Response } from "express";
import { getAllOTPs as getAllSourceOTPs } from "../../buttercup";

export async function getAllOTPs(req: Request, res: Response) {
    const otps = getAllSourceOTPs();
    res.json({
        otps
    });
}
