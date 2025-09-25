import userModel from "../models/userModel.js";
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
