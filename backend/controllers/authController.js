import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import nodemailer from "nodemailer";
import crypto from "crypto";
import dotenv from 'dotenv';

dotenv.config();

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1h" });
}

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "wahwint72@gmail.com",
        pass: "myryqwsatdfhcppj",
    },
});

export const registerUser = async (req, res) => {
    const { fullName, email, password, profileImageUrl } = req.body;

    if (!fullName || !email || !password) {
        return res.status(400).json({ message: "All fields are required!" });
    }
    try {
        //check if email already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already exists." })
        }

        // generate confirmation code
        const confirmationCode = crypto.randomInt(100000, 999999).toString();

        // Generate verification token
        const verifytoken = crypto.randomBytes(32).toString("hex");


        //Create User
        const user = await User.create({
            fullName,
            email,
            password,
            profileImageUrl,
            verified: false,
            confirmationCode,
            verifytoken
        });

        const link = `https://mapito.onrender.com/api/auth/verify/${verifytoken}`;
        // send email
        await transporter.sendMail({
            from: process.env.EMAIL_USER || "wahwint72@gmail.com",
            to: email,
            subject: "Email Confirmation Code From Mapito",
            html: `
        <h2>Hello ${fullName},</h2>
        <p>Thanks for registering to Mapito. Please verify your email using the code below:</p>
        <h3>${confirmationCode}</h3>
      `,
        });

        res.status(201).json({
            message: "User registered. Please check your email for confirmation code.",
            email: user.email,
            verifytoken: user.verifytoken
        });
    } catch (err) {
        res
            .status(500)
            .json({ message: "Error occurred while registering user", error: err.message });
    }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "All fields are required!" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    if (user.verifytoken) {
      return res.status(400).json({ message: "Please verify your email first." });
    }

    res.status(200).json({
      id: user._id,
      user,
      token: generateToken(user._id),
    });
  } catch (err) {
    res.status(500).json({ message: "Error occurred while logging in user", error: err.message });
  }
};



export const getUserInfo = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }
        res.status(200).json(user);
    } catch (err) {
        res.status(500).json({ message: "Error occurred while registering user", error: err.message });
    }
};

export const getAllUsers = async (req, res) => {
    try {
        const allUsers = await User.find();
        res.status(201).json({ da })

    } catch (error) {
        res.status(500).json(error);
    }
};

export const verifyEmail = async (req, res) => {
  const { email, code } = req.body; // 6-digit code entered by user

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    if (user.confirmationCode !== code) {  // compare with confirmationCode
      return res.status(400).json({ message: "Invalid confirmation code" });
    }

    user.confirmed = true;              // mark user as verified
    user.confirmationCode = null;       // clear code
    user.verifytoken = null;          
    await user.save();

    res.status(200).json({
      message: "Email verified successfully",
      token: generateToken(user._id),
      user,
    });
  } catch (err) {
    res.status(500).json({ message: "Error verifying email", error: err.message });
  }
};
