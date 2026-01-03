import { OK } from "../config/http.js";
import SessionModel from "../models/session.model.js";
import catchErrors from "../utils/catchErrors.js";

export const getSessionsHandler = catchErrors(async (req, res) => {
  const currentSessionId = req.sessionId;
  const userId = req.userId;

  const sessions = await SessionModel.find({ userId });

  return res.status(OK).json({
    sessions: sessions.map((session) => ({
      ...session.toObject(),
      isCurrent: session._id.toString() === currentSessionId.toString()
    }))
  });
});