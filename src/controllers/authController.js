import userModel from "../models/userModel.js";
import generateToken from "../utils/generateToken.js";

export const register = async (req, res) => {
  const { name, email, password, role } = req.body;
  const user = await userModel.findOne({ email });
  if (user) {
    return res.status(400).json({
      status: "error",
      message: "User already exists",
      data: user,
    });
  }

  const newUser = await userModel.create({ name, email, password, role });
  const token = generateToken({ id: newUser._id, role: newUser.role });
  res.status(201).json({
    status: "success",
    message: "User registered successfully",
    data: {
      user: newUser,
      token,
    },
  });
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await userModel.findOne({ email }).select("+password");

  if (!user) {
    return res.status(401).json({
      status: "error",

      message: "Invalid credentials",
    });
  }

  if (!(await user.comparePassword(password))) {
    return res.status(401).json({
      status: "error",
      message: "Invalid credentials",
    });
  }
  if (!user) {
    return res.status(401).json({
      status: "error",
      message: "Invalid credentials",
    });
  }
  const token = generateToken({ id: user._id, role: user.role });

  res.status(200).json({
    status: "success",
    message: "User logged in successfully",
    data: {
      user,
      token,
    },
  });
};

export const getMe = async (req, res) => {
  const user = await userModel.findById(req.user.id);
  res.status(200).json({
    status: "success",
    message: "User profile fetched successfully",
    data: user,
  });
};
