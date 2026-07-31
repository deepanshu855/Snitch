import userModel from "../models/user.model.js";
import { config } from "../config/config.js";
import jwt from "jsonwebtoken";

export const sendTokenResponse = (res, user, message) => {
  const token = jwt.sign({ id: user._id }, config.JWT_SECRET, {
    expiresIn: "3d",
  });

  res.cookie("token", token);

  res.status(201).json({
    success: true,
    message,
    user: {
      id: user._id,
      email: user.email,
      fullName: user.fullName,
      contact: user.contact,
      role: user.role,
    },
  });
};

export const registerController = async (req, res, next) => {
  const { email, contact, password, fullname, isSeller } = req.body;

  const userExists = await userModel.findOne({
    $or: [{ email }, { contact }],
  });

  if (userExists) {
    const error = new Error("User already exists");
    error.status = 400;
    return next(error);
  }

  try {
    const newUser = await userModel.create({
      email,
      contact,
      password,
      fullName: fullname,
      role: isSeller ? "seller" : "buyer",
    });

    await sendTokenResponse(res, newUser, "User registered successfully");
  } catch (error) {
    next(error);
  }
};

export const loginController = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await userModel.findOne({ email });

    if (!user) {
      const error = new Error("Invalid email or password");
      error.status = 401;
      return next(error);
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      const error = new Error("Invalid email or password");
      error.status = 401;
      return next(error);
    }

    await sendTokenResponse(res, user, "User logged in successfully");
  } catch (error) {
    next(error);
  }
};

export const googleAuthCallbackController = async (req, res, next) => {
  const user=req.user;
  console.log("Google user profile:", user);

  res.redirect("http://localhost:5173/");
}
