import mongoose from "mongoose";

// Define the user schema
const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isVerified: { type: Boolean, default: false },
  isAdmin: { type: Boolean, default: false },
  forgotPasswordToken: { type: String },
  forgotPasswordTokenExpiry: { type: Date },
  verificationToken: { type: String },
  verificationTokenExpiry: { type: Date },
});

// Create the User model
const User = mongoose.models.users || mongoose.model("User", userSchema); 
export default User;