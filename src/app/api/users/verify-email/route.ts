import { connectToDatabase } from "@/dbConfig/config";
import { NextRequest, NextResponse } from "next/server";
import User from "@/models/userModel";

connectToDatabase();

export async function POST(req: NextRequest) {
  try {
    // grab the token from the request body
    const reqBody = await req.json();
    const { token } = reqBody;
    console.log("Received token:", token);

    // find the user in the database based on the provided token and check if the token is still valid
    const existingUser = await User.findOne({
      verificationToken: token,
      verificationTokenExpiry: { $gt: Date.now() }, // Check if the token is still valid
    });

    if (!existingUser) {
      return NextResponse.json(
        { message: "Invalid or expired token" },
        { status: 400 },
      );
    }

    // update the user's email verification status and remove the token and its expiry time
    existingUser.isVerified = true;
    existingUser.verificationToken = undefined;
    existingUser.verificationTokenExpiry = undefined;
    await existingUser.save();

    return NextResponse.json(
      { message: "Email verified successfully" },
      { status: 200 },
    );
  } catch (error: any) {
    console.error("Verify email error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
