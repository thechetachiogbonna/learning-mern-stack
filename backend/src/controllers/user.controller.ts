import { NOT_FOUND, OK } from "../config/http.js";
import UserModel from "../models/user.model.js";
import appAssert from "../utils/appAssert.js";
import catchErrors from "../utils/catchErrors.js";

const userHandler = catchErrors(async (req, res) => {
  const userId = req.userId;

  const user = await UserModel.findById(userId);

  appAssert(user, NOT_FOUND, "User not found");

  return res.status(OK).json(user.omitPassword());
});

export default userHandler;