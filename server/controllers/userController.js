import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Car from "../models/Car.js";
import User from "../models/User.js";
import { SESSION_KEY } from "../server.js";

//Generate JWT Token
const generateToken = (userId) => {
  const payload = { id: userId };
   return jwt.sign(payload, process.env.JWT_SECRET + SESSION_KEY, {
     expiresIn: "7d",
   });
};

export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password || password.length < 8) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.json({ success: false, message: "User already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });
    const token = generateToken(user._id.toString());
    res.json({ success: true, message: "User registered successfully", token });
  } catch (error) {
    console.error("Error:", error);
    res.json({ success: false, message: error.message });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.json({ success: false, message: "Incorrect password" });
    }
    const token = generateToken(user._id.toString());
    res.json({ success: true, message: "User logged in successfully", token });
  } catch (error) {
    console.error("Error:", error);
    res.json({ success: false, message: error.message });
  }
};

//Get User data using token (JWT)
export const getUserData = async (req, res) => {
  try {
    const { user } = req;
    res.json({
      success: true,
      message: "User data fetched successfully",
      user,
    });
  } catch (error) {
    console.error("Error:", error);
    res.json({ success: false, message: error.message });
  }
};

//Get All Cars for the frontend
export const getCars = async (req, res) => {
  try {
    const cars = await Car.find({ isAvailable: true });
    res.json({ success: true, message: "Cars fetched successfully", cars });
  } catch (error) {
    console.error("Error:", error);
    res.json({ success: false, message: error.message });
  }
};
