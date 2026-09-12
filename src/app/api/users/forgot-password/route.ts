import { sendEmail } from "@/helpers/mailer";
import { connectToDatabase } from "@/dbConfig/config";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";

connectToDatabase();

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (typeof email !== "string" || !email.trim()) {
      return NextResponse.json(
        { message: "A valid email address is required" },
        { status: 400 },
      );
    }

    const normalizedEmail = email.trim().toLowerCase();
    const existingUser = await User.findOne({ email: normalizedEmail });

    // Use the same response for unknown addresses to avoid revealing accounts.
    if (!existingUser) {
      return NextResponse.json(
        { message: "If that email is registered, a reset link has been sent" },
        { status: 200 },
      );
    }

    await sendEmail({
      email: existingUser.email,
      emailType: "RESET",
      userId: existingUser._id.toString(),
    });

    return NextResponse.json(
      { message: "If that email is registered, a reset link has been sent" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json(
      { message: "Unable to send the reset email" },
      { status: 500 },
    );
  }
}
