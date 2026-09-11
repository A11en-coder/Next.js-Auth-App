import { NextResponse } from "next/server";

export async function GET() {
  try {
    const response = NextResponse.json(
      { message: "Logout successful" },
      { status: 200 },
    );

    // Clear the token cookie
    response.cookies.set("token", "", {
      httpOnly: true,
      sameSite: "strict",
      maxAge: 0, // Set maxAge to 0 to clear the cookie
    });

    return response;
  } catch (error: any) {
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
