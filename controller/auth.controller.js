import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { OAuth2Client } from "google-auth-library";
import User from "../models/user.model.js";

dotenv.config();

export const signup = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res
        .status(400)
        .json({ message: "User already exists. Login to continue" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPassword });
    if (user)
      res.status(201).json({
        message: "User created successfully. Login to continue",
      });
    else
      res.status(400).json({
        message: "User not created",
      });
  } catch (error) {
    console.error("signup error:", error);
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user)
      return res
        .status(404)
        .json({ message: "User not found. Please sign up first" });

    const validatePassword = await bcrypt.compare(password, user.password);
    if (!validatePassword)
      return res.status(401).json({ message: "Invalid password" });

    const { _id, name, role } = user;
    const token = jwt.sign(
      { _id, name, email: user.email, role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );
    // prettier-ignore
    res
      .status(200)
      .json({ message: "Login successful", user: { _id, name, email, role }, token });
  } catch (error) {
    console.error("login error:", error);
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};

export const oauthLogin = async (req, res) => {
  const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
  const { token } = req.body;
  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const { email, name, picture: avatar } = payload;

    let user = await User.findOne({ email });
    if (user && user.password)
      return res
        .status(400)
        .json({ message: "User already exists. Login to continue" });
    if (!user)
      user = await User.create({ name, email, avatar, password: null });

    const { _id, role } = user;
    const jwtToken = jwt.sign(
      { _id, name: user.name, email: user.email, role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).json({
      message: "Login successful",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar,
      },
      token: jwtToken,
    });
  } catch (error) {
    console.error("oauthLogin error:", error);
    res.status(401).json({ message: "Invalid or expired Google token" });
  }
};

export const verifyToken = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ message: "Unauthorized: No token provided" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded)
      return res.status(401).json({ message: "Unauthorized: Invalid token" });

    const user = await User.findById(decoded._id).select("-password");
    if (!user)
      return res.status(401).json({ message: "Unauthorized: User not found" });

    res.status(200).json({
      user,
      message: "Token verified successfully",
    });
  } catch (error) {
    console.error("verifyToken error:", error);
    const isExpired = error.name === "TokenExpiredError";
    res.status(401).json({
      message: isExpired
        ? "Unauthorized: Token expired"
        : "Unauthorized: Invalid token",
    });
  }
};
