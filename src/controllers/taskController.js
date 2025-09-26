import taskModel from "../models/taskModel.js";
import userModel from "../models/userModel.js";
import sendEmail from "../utils/sendEmail.js";

export const createTask = async (req, res) => {
  const { title, description, dueDate, assignedTo, createdBy } = req.body;
  const createrId = req.user.id;
  const createrName = req.user.role;
  console.log(createrName);
  const assignedUser = await userModel.findById(assignedTo);
  if (!assignedUser) {
    return res.status(404).json({
      status: "error",
      message: "Assigned user not found",
    });
  }
  const newTask = await taskModel.create({
    title,
    description,
    dueDate,
    assignedTo,
    createdBy: createrId,
  });

  sendEmail({
    to: assignedUser.email,
    subject: `New Task Assigned to you`,
    text: `Hello ${assignedUser.name} \n
    You have been assigned a new task: ${title} by ${createrName}. Login and check you SJCU Portal\n \n 
    description : ${description}
    \n\n DueDate: ${dueDate}    
    `,
  });
  res.status(201).json({
    status: "success",
    message: "Task created successfully",
    data: newTask,
  });
};

export const getAllTasks = async (req, res) => {
  const requestUserByID = req.user.id;
  const requestUserRole = req.user.role;
  let tasks;

  // have to add pagination

  if (requestUserRole === "Admin" || requestUserRole === "Viewer") {
    tasks = await taskModel.find().populate("assignedTo createdBy");
  } else if (requestUserRole === "Manager") {
    tasks = await taskModel
      .find({ createdBy: requestUserByID })
      .populate("assignedTo createdBy");
  } else {
    tasks = await taskModel
      .find({ assignedTo: requestUserByID })
      .populate("assignedTo createdBy");
  }
  res.status(200).json({
    status: "success",
    messgae: "Task fetched successfully",
    data: tasks,
  });
};

export const updateTask = async (req, res) => {
  const { assignedTo, status } = req.body;
  const taskId = req.params.id;

  if (assignedTo) {
    const assignedUser = await userModel.findById(assignedTo);
    if (!assignedUser) {
      return res.status(404).json({
        status: "error",
        message: "Assigned user not found",
      });
    }
  }

  const task = await taskModel.findById(taskId);
  if (req.user.role === "Admin") {
    Object.assign(task, req.body);
  } else if (
    req.user.role === "Manager" &&
    task.createdBy.toString() === req.user.id
  ) {
    Object.assign(task, req.body);
  } else if (
    req.user.role == "Employee" &&
    task.assignedTo.toString() === req.user.id
  ) {
    if (!status) {
      return res.status(401).json({
        status: "error",
        message: "Status is required",
      });
    }
    task.status = status;
  } else {
    return res.status(401).json({
      status: "error",
      message: "You are not authorized to update this task",
    });
  }

  await task.save();

  //   sendEmail({
  //     to: task.email,
  //     subject: `Updates in your task ${task.title}`,
  //     text: `Hello ${task.name} \n
  //     Your task ${task.title} might have some updates. Login and check you SJCU Portal\n \n
  //     description : ${task.description}
  //     \n\n DueDate: ${task.dueDate}
  //     `,
  //   });
  res.status(200).json({
    status: "success",
    message: "Task updated successfully",
    data: task,
  });

  //   if (req.user.role === "Employee") {
  //     await taskModel.findByIdAndUpdate(taskId, { status });
  //   }else(req.user.role == "Admin"){
  //     await taskModel.find
  //   }
};

export const delteTask = async (req, res) => {
  const { id } = req.params;

  const deltedtask = await taskModel.findByIdAndDelete(id);

  res.status(200).json({
    status: "Success",
    message: "Task deleted successfully",
    data: deltedtask,
  });
};
