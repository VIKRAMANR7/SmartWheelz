import type { Types } from "mongoose";
import type { IUser } from "../models/User";

declare global {
  namespace Express {
    interface Request {
      user?: (IUser & { _id: Types.ObjectId }) | null;
    }
  }
}
