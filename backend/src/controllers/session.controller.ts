import z from "zod";
import { NOT_FOUND, OK } from "../config/http.js";
import SessionModel from "../models/session.model.js";
import appAssert from "../utils/appAssert.js";
import catchErrors from "../utils/catchErrors.js";

export const getSessionsHandler = catchErrors(async (req, res) => {
  const currentSessionId = req.sessionId;
  const userId = req.userId;

  const sessions = await SessionModel.find({ userId }).sort({ createdAt: -1 });

  return res.status(OK).json({
    sessions: sessions.map((session) => ({
      ...session.toObject(),
      ...(session._id.toString() === currentSessionId.toString() && { isCurrent: true })
    })).sort((a, b) => (a.isCurrent ? -1 : 0))
  });
});

export const deleteSessionHandler = catchErrors(async (req, res) => {
  const sessionId = z.string().length(24).parse(req.params.id);
  const userId = req.userId;

  const session = await SessionModel.findOneAndDelete({
    _id: sessionId,
    userId
  });

  appAssert(session, NOT_FOUND, "Session not found");

  return res.status(OK).json({ message: "Session deleted successfully." });
});