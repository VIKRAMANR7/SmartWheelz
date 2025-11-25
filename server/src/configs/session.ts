import crypto from "crypto";

export const SESSION_KEY = crypto.randomBytes(32).toString("hex");
