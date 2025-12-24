import mongoose from "mongoose";
import { thirtyDaysFromNow } from "../utils/date.js";

export interface SessionDocument extends mongoose.Document {
  userId: mongoose.Types.ObjectId,
  ip?: string,
  userAgent?: string,
  createdAt: Date,
  expiresAt: Date
}

const sessionSchema = new mongoose.Schema<SessionDocument>({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true
  },
  ip: {
    type: String
  },
  userAgent: {
    type: String
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now
  },
  expiresAt: {
    type: Date,
    required: true,
    default: thirtyDaysFromNow
  }
});

const SessionModel = mongoose.model<SessionDocument>("Session", sessionSchema);

export default SessionModel;