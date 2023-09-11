import { Response } from "express";

export const handleControllerErrors = (
    err: unknown,
    res: Response,
    defaultErrorMessage: string
): Response => {
    if (err instanceof Error)
        return res.status(500).json({ error: err.message });
    return res.status(500).json({ error: defaultErrorMessage });
};
