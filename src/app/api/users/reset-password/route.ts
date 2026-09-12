import bcrypt from "bcryptjs";
import { connectToDatabase } from "@/dbConfig/config";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";

connectToDatabase();

export async function POST(req: NextRequest) {
  try {
    const { token, password, confirmPassword } = await req.json();

    if (!token || !password || !confirmPassword) {
      return NextResponse.json(
        { message: "Token and both password fields are required" },
        { status: 400 },
      );
    }

    if (password !== confirmPassword) {
      return NextResponse.json(
        { message: "Passwords do not match" },
        { status: 400 },
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { message: "Password must be at least 8 characters long" },
        { status: 400 },
      );
    }

    const existingUser = await User.findOne({
      forgotPasswordToken: token,
      forgotPasswordTokenExpiry: { $gt: new Date() },
    });

    if (!existingUser) {
      return NextResponse.json(
        { message: "This reset link is invalid or expired" },
        { status: 400 },
      );
    }

    existingUser.password = await bcrypt.hash(password, 10);
    existingUser.forgotPasswordToken = undefined;
    existingUser.forgotPasswordTokenExpiry = undefined;
    await existingUser.save();

    return NextResponse.json(
      { message: "Password reset successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Reset password error:", error);
    return NextResponse.json(
      { message: "Unable to reset password" },
      { status: 500 },
    );
  }
}
