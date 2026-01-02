import type mongoose from "mongoose";
import type { mongo } from "mongoose";

declare global {
  namespace Express {
    interface Request {
      userId: mongoose.Types.ObjectId;
      sessionId: mongoose.Types.ObjectId;
    }
  }
}