import type { IUserWithId } from "../models/User";

declare global {
  namespace Express {
    interface Request {
      user?: IUserWithId;
    }
  }
}
