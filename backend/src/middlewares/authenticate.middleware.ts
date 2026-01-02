import type { RequestHandler } from "express";
import appAssert from "../utils/appAssert.js";
import { UNAUTHORIZED } from "../config/http.js";
import { verifyToken } from "../utils/jwt.js";
import AppErrorCode from "../constants/appErrorCode.js";
import SessionModel from "../models/session.model.js";

const authenticate: RequestHandler = async (req, res, next) => {
  try {
    const accessToken = req.cookies?.accessToken;

    appAssert(accessToken, UNAUTHORIZED, "Access token is missing", AppErrorCode.InvalidAccessToken);

    const accessTokenPayload = verifyToken(accessToken);

    appAssert(accessTokenPayload, UNAUTHORIZED, "Invalid access token");

    const session = await SessionModel.findOne({
      _id: accessTokenPayload.sessionId,
      userId: accessTokenPayload.userId
    });
    appAssert(session, UNAUTHORIZED, "Session not found");

    req.userId = accessTokenPayload.userId;
    req.sessionId = accessTokenPayload.sessionId;

    next();
  } catch (error) {
    console.log(error);
    next(error);
  }
}

export default authenticate;