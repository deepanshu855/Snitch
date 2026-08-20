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
  const { id, emails, displayName } = req.user;
  const email = emails[0].value;

  let user = await userModel.findOne({ email });

  if (!user) {
    user = await userModel.create({
      email,
      fullName: displayName,
      role: "buyer",
      googleId: id,
    });
  }

  const token = jwt.sign({ id: user._id }, config.JWT_SECRET, {
    expiresIn: "3d",
  });

  res.cookie("token", token);

  res.redirect("http://localhost:5173/");
};

export const getMeController= async (req, res, next)=>{
  const userId = req.user.id;

  const user= await userModel.findById(userId).select("-password");

  if(!user){
    const error= new Error("User not found");
    error.status=404;
    return next(error);
  }

  sendTokenResponse(res, user, "User fetched successfully");
}

export const logoutControler= async(req, res,next)=>{
  const token=req.cookies.token;

  res.clearCookie("token");

  res.status(200).json({
    success: true,
    message: "Logot successfully"
  })
}
