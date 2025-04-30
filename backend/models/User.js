import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const UserSchema = new mongoose.Schema({
    googleId: {
        type: String,
        default: null,
    },
    fullName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: function () {
            return !this.googleId; 
        },
    },
    profileImageUrl: {
        type: String,
        default: null,
    },
    verifytoken:{
        type: String,
    }
}, { timestamps: true });

// Hash password before saving, but only if there's a password and it's modified
UserSchema.pre("save", async function (next) {
    if (!this.isModified("password") || !this.password) return next();
    const hashedPassword = await bcrypt.hash(this.password, 10);
    console.log("Hashed Password: ", hashedPassword); 
    this.password = hashedPassword;
    next();
});


// Compare provided password with hashed password
UserSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};


const User = mongoose.model("User", UserSchema);
export default User;
