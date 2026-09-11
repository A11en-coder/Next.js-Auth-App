import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

export const getDataFromToken = (request: NextRequest) => {
  try {
    // Get the token from the request cookies
    const token = request.cookies.get("token")?.value;

    // If the token is not found, throw an error
    if (!token) {
      throw new Error("Token not found");
    }

    // Verify and decode the token using the secret key
    const decoded = jwt.verify(token, process.env.TOKEN_SECRET as string);
    
    // return the user id from the decoded token
    return (decoded as { id: string }).id;
  } catch (error) {
    console.error("Error retrieving token:", error);
    return null;
  }
};
