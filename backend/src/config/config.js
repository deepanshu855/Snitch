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

if (!process.env.GOOGLE_CLIENT_ID) {
  const error = new Error(
    "GOOGLE_CLIENT_ID is not defined in environment variables",
  );
  throw error;
}

if (!process.env.GOOGLE_CLIENT_SECRET) {
  const error = new Error(
    "GOOGLE_CLIENT_SECRET is not defined in environment variables",
  );
  throw error;
}

if (!process.env.IMAGEKIT_PUBLIC_KEY) {
  const error = new Error(
    "IMAGEKIT_PUBLIC_KEY is not defined in environment variables",
  );
  throw error;
}

if (!process.env.IMAGEKIT_PRIVATE_KEY) {
  const error = new Error(
    "IMAGEKIT_PRIVATE_KEY is not defined in environment variables",
  );
  throw error;
}

if (!process.env.RAZORPAY_KEY_ID) {
  throw new Error("Razorpay id not defined in environmental variables");
}

if (!process.env.RAZORPAY_KEY_SECRET) {
  throw new Error("Razorpay secret is not defined in environmental variables");
}

export const config = {
  NODE_ENV: process.env.NODE_ENV,
  MONGO_URI: process.env.MONGO_URI,
  JWT_SECRET: process.env.JWT_SECRET,
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
  IMAGEKIT_PUBLIC_KEY: process.env.IMAGEKIT_PUBLIC_KEY,
  IMAGEKIT_PRIVATE_KEY: process.env.IMAGEKIT_PRIVATE_KEY,
  RAZORPAY_KEY_ID: process.env.RAZORPAY_KEY_ID,
  RAZORPAY_KEY_SECRET: process.env.RAZORPAY_KEY_SECRET,
};
