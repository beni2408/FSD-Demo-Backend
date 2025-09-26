import { Router } from "express";
import {
  delteTask,
  getAllTasks,
  createTask,
  updateTask,
} from "../controllers/taskController.js";
import { protect } from "../middlewares/authMiddleware.js";
import authorizeRole from "../middlewares/roleMiddleware.js";

const taskRouter = Router();

taskRouter.get("/", protect, getAllTasks);
taskRouter.post("/", protect, authorizeRole("Admin", "Manager"), createTask);
taskRouter.put("/:id", protect, authorizeRole("Admin", "Manager"), updateTask);
taskRouter.delete("/:id", protect, authorizeRole("Admin"), delteTask);

export default taskRouter;
