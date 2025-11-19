import type { Response } from "express";

export function handleControllerError(res: Response, _error: unknown): void {
  res.status(500).json({
    success: false,
    message: "Something went wrong",
  });
}
