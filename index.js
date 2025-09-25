import express from "express";
import dotenv from "dotenv";
import connectDB from "./src/config/db.js";
dotenv.config();
import authRouter from "./src/routes/authRoutes.js";
import { errorHAndler } from "./src/middlewares/errorHandler.js";

const app = express();
app.use(express.json());
//debug helper => consoles request type, req url, req time
app.use((req, res, next) => {
  console.log(req.method, req.url, new Date().toLocaleString());
  next();
});

app.use("/", (req, res) => {
  res.send("<h2>Welcome to the Task Manager API</h2>");
});

app.use("/api/auth", authRouter);
const PORT = process.env.PORT || 3080;
app.use(errorHAndler);
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  connectDB();
});
