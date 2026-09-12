"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "react-hot-toast";

export default function VerifyEmailPage() {
  const router = useRouter();

  // initialize state for the token and isEmailVerified
  const [token, setToken] = React.useState("");
  const [isEmailVerified, setIsEmailVerified] = React.useState(false);
  const [verificationError, setVerificationError] = React.useState("");

  const verifyEmail = async () => {
    try {
      // Make a POST request to the verify-email API endpoint with the token
      const response = await axios.post("/api/users/verify-email", { token });
      console.log("Email verification successful:", response.data);
      setIsEmailVerified(true);
      toast.success("Email verified successfully!");
    } catch (error: any) {
      console.error("Error during email verification:", error);
      setVerificationError(
        "We could not verify your email. This link may be invalid or expired. Please request a new verification email and try again.",
      );
      toast.error("Email verification failed. Please try again.");
    }
  };

  // this useEffect will run once the page is loaded and will grab the token from the URL query parameters and set it to the state
  useEffect(() => {
    const urlToken = new URLSearchParams(window.location.search).get("token");
    if (urlToken) {
      setToken(urlToken);
    } else {
      setVerificationError(
        "This verification link is missing its token. Please request a new verification email.",
      );
    }
  }, []);

  // the second useEffect will run once the token state is set and will call the verifyEmail function to verify the email
  useEffect(() => {
    if (token) {
      verifyEmail();
    }
  }, [token]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen py-2">
            <h1 className="text-4xl font-bold mb-4">
              {isEmailVerified
                ? "Email Verified!"
                : verificationError
                ? "Verification Unsuccessful"
                : "Verifying Email..."}
            </h1>
            {isEmailVerified ? (
                <p className="text-green-600">Your email has been successfully verified. You can now log in.</p>
            ) : verificationError ? (
              <p className="text-red-600 text-center max-w-md">{verificationError}</p>
            ) : (
                <p className="text-gray-600">Please wait while we verify your email...</p>
            )}
        </div>
    );
}
