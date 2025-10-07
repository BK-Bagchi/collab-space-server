import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

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
        message: "User created successfully",
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
    res
      .status(200)
      .json({ message: "Login successful", user: { _id, email, role }, token });
  } catch (error) {
    console.error("login error:", error);
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};
