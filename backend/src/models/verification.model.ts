import mongoose from "mongoose";
import type VerificationType from "../constants/verificationTypes.js";

interface VerificationDocument extends mongoose.Document {
  userId: mongoose.Types.ObjectId,
  type: VerificationType,
  expiresAt: Date,
  createdAt: Date
}

const VerificationSchema = new mongoose.Schema<VerificationDocument>({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
    index: true
  },
  type: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now
  },
  expiresAt: {
    type: Date,
    required: true
  }
})

const VerificationModel = mongoose.model<VerificationDocument>("Verification", VerificationSchema);

export default VerificationModel