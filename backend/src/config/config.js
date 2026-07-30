import dotenv from "dotenv";
dotenv.config();

if (!process.env.MONGO_URI) {
  const error = new Error("MONGO_URI is not defined in environment variables");
  throw error;
}

if (!process.env.JWT_SECRET) {
  const error = new Error("JWT_SECRET is not defined in environment variables");
  throw error;
}

export const config = {
  NODE_ENV: process.env.NODE_ENV,
  MONGO_URI: process.env.MONGO_URI,
  JWT_SECRET: process.env.JWT_SECRET,
};
