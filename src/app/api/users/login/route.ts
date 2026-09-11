import { connectToDatabase } from "@/dbConfig/config";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

connectToDatabase();

export async function POST(req: NextRequest) {
  try {
    // grab the email and password from the request body
    const reqBody = await req.json();
    const { email, password } = reqBody;
    console.log("Received data:", { email, password });

    // Check if the user exists
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Compare the provided password with the hashed password in the database
    const isPasswordValid = await bcrypt.compare(
      password,
      existingUser.password,
    );
    if (!isPasswordValid) {
      return NextResponse.json(
        { message: "Invalid password" },
        { status: 401 },
      );
    }

    // create token data
    const tokenData = {
      id: existingUser._id,
      username: existingUser.username,
      email: existingUser.email,
    };

    // Generate a JWT token
    const token = jwt.sign(tokenData, process.env.TOKEN_SECRET as string, {
      expiresIn: "1h", // Token expiration time
    });

    const response = NextResponse.json(
      { message: "Login successful", token },
      { status: 200 },
    );

    // Set the token in a cookie
    response.cookies.set("token", token, {
      httpOnly: true,
      sameSite: "strict",
      maxAge: 3600, // 1 hour in seconds
    });

    return response;
  } catch (error: any) {
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
