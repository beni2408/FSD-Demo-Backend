import userModel from "../models/userModel.js";
import sendEmail from "../utils/sendEmail.js";

export const createUser = async (req, res) => {
  const { name, email, password, role } = req.body;
  const user = await userModel.findOne({ email });
  if (user) {
    return res.status(400).json({
      status: "error",
      message: "User already exists",
      data: user,
    });
  }
  const newUser = await userModel.create({
    name,
    email,
    password: password || "Password123",
    role,
  });

  sendEmail({
    to: email,
    subject: "Welcome to St.John's Carol union Portal",
    text: `Hello ${name},\n\nWelcome to the St.John's Carol union. Your account has been created successfully.\n\nYour password is: ${
      password || "Password123"
    } , Role : ${
      newUser.role
    }\n\nPlease login to the system and change your password.\n\nRegards,\nTeam St.John's Carol`,
  });

  res.status(201).json({
    status: "success",
    message: "User created successfully",
    data: newUser,
  });
};
export const getAllUsers = async (req, res) => {
  const users = await userModel.find();
  res.status(200).json({
    status: "success",
    message: "Users fetched successfully",
    data: users,
  });
};

export const updateUserRole = async (req, res) => {
  const { id } = req.params;
  const { updatedrole } = req.body;
  const user = await userModel.findById(id);
  user.role = updatedrole;
  await user.save();

  if (!user) {
    return res.status(404).json({
      status: "error",
      message: "User not found",
    });
  }
  res.status(200).json({
    status: "success",
    message: "User role updated successfully",
    data: user,
  });
};

export const deleteUser = async (req, res) => {
  const { id } = req.params;
  const user = await userModel.findByIdAndDelete(id);
  if (!user) {
    return res.status(404).json({
      status: "error",
      message: "User not found",
    });
  }

  res.status(200).json({
    status: "success",
    message: "User deleted successfully",
  });
};
