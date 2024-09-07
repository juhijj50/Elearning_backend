import jwt from "jsonwebtoken";
import { User } from "../models/User.js";

export const isAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization; // Use Authorization header
    const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null; // Extract token

    if (!token)
      return res.status(403).json({
        message: "No token provided. Please login.",
      });

    if (!process.env.JWT_SEC)
      return res.status(500).json({
        message: "JWT_SECRET is not defined in environment variables.",
      });

    const decodedData = jwt.verify(token, process.env.JWT_SEC);

    req.user = await User.findById(decodedData._id);

    if (!req.user) {
      return res.status(404).json({
        message: "User not found.",
      });
    }

    next();
  } catch (error) {
    console.error(error); // Log error for debugging
    res.status(401).json({
      message: "Invalid token or token expired.",
    });
  }
};

export const isAdmin = (req, res, next) => {
  try {
    if (!req.user)
      return res.status(403).json({
        message: "User not authenticated.",
      });

    if (req.user.role !== "admin")
      return res.status(403).json({
        message: "You are not an admin.",
      });

    next();
  } catch (error) {
    console.error(error); // Log error for debugging
    res.status(500).json({
      message: "An error occurred while checking admin status.",
    });
  }
};
