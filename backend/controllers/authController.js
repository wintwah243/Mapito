import User from '../models/User.js';
import jwt from 'jsonwebtoken';

const generateToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET, {expiresIn: "1h"});
}

export const registerUser = async(req,res) => {
    console.log("req.body:", req.body);
    const {fullName, email, password, profileImageUrl} = req.body;

    if(!fullName || !email || !password){
        return res.status(400).json({message:"All fields are required!"});
    }
    try{
        //check if email already exists
        const existingUser = await User.findOne({email});
        if(existingUser){
            return res.status(400).json({message:"Email already exists."})
        }

        //Create User
        const user = await User.create({
            fullName,
            email,
            password,
            profileImageUrl
        });
        res.status(201).json({
            id: user._id,
            user,
            token:generateToken(user._id)
        });
    }catch (err){
        res.status(500).json({message: "Error occured while registrating user", error: err.message})
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
