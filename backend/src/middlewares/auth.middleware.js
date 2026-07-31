import jwt from "jsonwebtoken";
import { config } from "../config/config.js";
import userModel from "../models/user.model.js";

export const authenticateUser = async (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    const error = new Error("Unauthorized Access");
    error.status = 401;
    return next(error);
  }

  let decodedToken;
  try {
    decodedToken = jwt.verify(token, config.JWT_SECRET);

    const user = await userModel.findById(decodedToken.id);
    
    if (!user) {
      const error = new Error("Unauthorized Access");
      error.status = 401;
      return next(error);
    }

    req.user = decodedToken;
    next();
  } catch (err) {
    next(err);
  }
};

export const authenticateSeller = async (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    const error = new Error("Unauthorized Access");
    error.status = 401;
    return next(error);
  }

  let decodedToken;
  try {
    decodedToken = jwt.verify(token, config.JWT_SECRET);
    const { id } = decodedToken;

    const user = await userModel.findById(id);

    if (!user) {
      const error = new Error("Unauthorized Access");
      error.status = 401;
      return next(error);
    }

    if (user.role !== "seller") {
      const error = new Error("Forbidden Access");
      error.status = 403;
      return next(error);
    }

    req.user = decodedToken;
    next();
  } catch (err) {
    next(err);
  }
};
