import express from "express";
import {
    registerUser,
    loginUser,
    getUserInfo
} from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";
import { upload } from "../middleware/uploadMiddleware.js";
import passport from "passport";
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import bcrypt from "bcryptjs";
import dotenv from 'dotenv';
import { cloudinary, storage } from '../config/cloudinary.js'
import fs from 'fs';
dotenv.config();
const keysecret = process.env.JWT_SECRET;
import User from "../models/User.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/getUser", protect, getUserInfo);

router.post("/upload-image", upload.single("image"), (req,res) => {
    if(!req.file){
        return res.status(400).json({message: "No file uploaded"})
    }

    const imageUrl = `${req.protocol}://${req.get("host")}/uploads/${
    req.file.filename
    }`;
    res.status(200).json({imageUrl});
});

//email config
const transporter = nodemailer.createTransport({
    service:"gmail",
    auth:{
        user:"wahwint72@gmail.com",
        pass:"myryqwsatdfhcppj"
    }
});

//send email link for reset password
router.post("/sendpasswordlink", async(req, res) => {
    console.log("Request body:", req.body);

    const {email} = req.body;
    
    if(!email) {
        console.log("No email provided");
        return res.status(400).json({status:400, message:"Email is required"});
    }

    try {
        console.log("Looking for user with email:", email);
        const userfind = await User.findOne({email:email});
        
        if(!userfind) {
            console.log("User not found for email:", email);
            return res.status(404).json({status:404, message:"User not found"});
        }

        console.log("User found, generating token...");
        const token = jwt.sign({_id: userfind._id}, keysecret, {
            expiresIn: "1d"
        });

        console.log("Updating user with token...");
        const setusertoken = await User.findByIdAndUpdate(
            {_id: userfind._id}, 
            {verifytoken: token}, 
            {new: true}
        );

        console.log("Preparing email...");
        const mailOptions = {
            from: process.env.EMAIL_USER || "wahwint72@gmail.com",
            to: email,
            subject: "Password Reset Request",
            text: `Please click this link to reset your password: ${process.env.FRONTEND_URL || 'http://localhost:5173'}/forgotpassword/${userfind._id}/${token}`
        };

        console.log("Sending email...");
        transporter.sendMail(mailOptions, (error, info) => {
            if(error) {
                console.error("Email sending failed:", error);
                return res.status(500).json({status:500, message:"Failed to send email"});
            }
            console.log("Email sent successfully:", info.response);
            return res.status(200).json({status:200, message:"Email sent successfully"});
        });
        
    } catch(error) {
        console.error("Server error:", error);
        res.status(500).json({status:500, message:"Internal server error"});
    }
});

//verify user for forgot password
router.get("/forgotpassword/:id/:token", async (req, res) => {
    const { id, token } = req.params;

    try {
        // Check if user exists with this token
        const validuser = await User.findOne({ 
            _id: id, 
            verifytoken: token 
        });

        if (!validuser) {
            return res.status(404).json({ 
                status: 404, 
                message: "User not found with this token" 
            });
        }

        // Verify token
        const verifyToken = jwt.verify(token, keysecret);
        console.log("Token verified for:", validuser.email);

        res.status(200).json({ 
            status: 200, 
            message: "Token valid",
            email: validuser.email,
            id: validuser._id
        });

    } catch (error) {
        console.error("Token verification error:", error.message);
        
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ 
                status: 401, 
                message: "Token expired" 
            });
        }
        
        res.status(401).json({ 
            status: 401, 
            message: "Invalid token" 
        });
    }
});

//change password
router.post("/:id/:token", async (req, res) => {
    const { id, token } = req.params;
    const { password } = req.body;
  
    try {
        // Find user with matching id and token
        const validuser = await User.findOne({ 
            _id: id, 
            verifytoken: token 
        });

        if (!validuser) {
            console.log("No user found with this token");
            return res.status(404).json({ 
                status: 404, 
                message: "Invalid reset link" 
            });
        }

        // Verify token
        const verifyToken = jwt.verify(token, keysecret);
        console.log("Token verified for:", validuser.email);

        // Hash new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Update user
        const updatedUser = await User.findByIdAndUpdate(
            id,
            {
                password: hashedPassword,
                verifytoken: null // Clear the token
            },
            { new: true }
        );

        console.log("Password updated for:", updatedUser.email);
        res.status(200).json({ 
            status: 200, 
            message: "Password updated successfully" 
        });

    } catch (error) {
        console.error("Password update error:", error);
        
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ 
                status: 401, 
                message: "Reset link expired" 
            });
        }
        
        res.status(500).json({ 
            status: 500, 
            message: "Internal server error" 
        });
    }
});


// Update user profile info (Name and Bio)
router.put("/update-profile", protect, async (req, res) => {
    const { name, bio } = req.body;
  
    // Validate at least one field is being updated
    if (!name && !bio) {
      return res.status(400).json({ 
        message: "At least one field (name or bio) is required for update" 
      });
    }
  
    try {
      const user = await User.findById(req.user.id);
      if (!user) return res.status(404).json({ message: "User not found" });
  
      // Update only the fields that were provided
      if (name) user.fullName = name;
      if (bio) user.bio = bio;
  
      await user.save();
  
      res.status(200).json({ 
        success: true,
        user: {
          id: user._id,
          fullName: user.fullName,
          email: user.email,
          bio: user.bio,
          profileImageUrl: user.profileImageUrl
        }
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ 
        success: false,
        message: "Error updating profile",
        error: err.message 
      });
    }
});
  
  // Update user profile picture
  router.put("/update-profile-pic", 
    protect, 
    upload.single("profilePic"), 
    async (req, res) => {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }
  
      const tempFilePath = req.file.path;
      let cloudinaryResult;
  
      try {
        const user = await User.findById(req.user.id);
        if (!user) {
          return res.status(404).json({ message: "User not found" });
        }
  
        // Upload to Cloudinary
        cloudinaryResult = await cloudinary.uploader.upload(tempFilePath, {
          folder: "profile_images",
          use_filename: true,
          unique_filename: false,
        });
  
        // Update user profile
        user.profileImageUrl = cloudinaryResult.secure_url;
        await user.save();
  
        // Cleanup temp file
        try {
          fs.unlinkSync(tempFilePath);
        } catch (unlinkErr) {
          console.error('Failed to delete temp file:', unlinkErr);
        }
  
        res.status(200).json({ 
          message: "Profile picture updated successfully",
          imageUrl: cloudinaryResult.secure_url
        });
  
      } catch (err) {
        console.error('Profile pic update error:', err);
  
        // Cleanup temp file if upload failed
        if (tempFilePath && fs.existsSync(tempFilePath)) {
          try {
            fs.unlinkSync(tempFilePath);
          } catch (unlinkErr) {
            console.error('Failed to cleanup temp file:', unlinkErr);
          }
        }
  
        // Cloudinary-specific errors
        if (err.message.includes('Cloudinary')) {
          return res.status(502).json({ 
            message: 'Failed to upload image to cloud service'
          });
        }
  
        res.status(500).json({ 
          message: "Error updating profile picture",
          error: process.env.NODE_ENV === 'development' ? err.message : undefined
        });
      }
    }
  );


// Initial Google OAuth login
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));
router.get("/google/callback", passport.authenticate("google", {
    session: false, 
}), (req, res) => {
    const token = jwt.sign(
        { id: req.user._id },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
    );

    res.redirect(`http://localhost:5173/google-auth?token=${token}`);
});

export default router;