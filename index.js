import express from "express";
import dotenv from "dotenv";
import connectDB from "./src/config/db.js";
dotenv.config();
import authRouter from "./src/routes/authRoutes.js";
import { errorHAndler } from "./src/middlewares/errorHandler.js";
import userRouter from "./src/routes/userRoutes.js";
import taskRouter from "./src/routes/taskRoutes.js";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors());
//debug helper => consoles request type, req url, req time
app.use((req, res, next) => {
  console.log(req.method, req.url, new Date().toLocaleString());
  next();
});

app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);
app.use("/api/tasks", taskRouter);
const PORT = process.env.PORT || 3080;
app.use(errorHAndler);
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  connectDB();
});
