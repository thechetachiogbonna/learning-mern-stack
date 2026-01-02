import express from "express"
import cors from "cors"
import connectToDatabase from "./config/db.js";
import { APP_ORIGIN, PORT } from "./constants/env.js";
import cookieParser from "cookie-parser";
import errorHandler from "./middlewares/error.middleware.js";
import { OK } from "./config/http.js";
import authRoutes from "./routes/auth.route.js";
import userRoutes from "./routes/user.route.js";
import authenticate from "./middlewares/authenticate.middleware.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: APP_ORIGIN,
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));
app.use(cookieParser());

app.get("/", (_, res) => {
  return res.status(OK).json({ message: "Server is running" });
});

app.use("/api/auth", authRoutes);
app.use("/api/user", authenticate, userRoutes);

app.use(errorHandler);

app.listen(PORT, async () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  await connectToDatabase();
});