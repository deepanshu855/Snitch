import jwt from "jsonwebtoken";
import { config } from "../config/config.js";

export const identifyUser = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    const error = new Error("Unauthorized Access");
    error.status = 401;
    return next(error);
  }

  let decodedToken = null;
  try {
    decodedToken = jwt.verify(token, config.JWT_SECRET);
    req.user = decodedToken;
    next();
  } catch (err) {
    next(err);
  }
};
