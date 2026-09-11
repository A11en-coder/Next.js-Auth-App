import { getDataFromToken } from "@/helpers/getDataFromToken";
import { NextRequest, NextResponse } from "next/server";
import User from "@/models/userModel";
import { connectToDatabase } from "@/dbConfig/config";

connectToDatabase();

export async function GET(request: NextRequest) {
  try {
    // get the user id from the token
    const userId = getDataFromToken(request);

    // find the user by id
    const user = await User.findById(userId).select("-password");

    // if user is not found, return 404
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // return the user data
    return NextResponse.json({ user }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
