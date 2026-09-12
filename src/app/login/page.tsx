"use client";
import React, { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function LoginPage() {
  // Initialize the router
  const router = useRouter();

  // Initialize state for user credentials, button disabled state, and loading state
  const [user, setUser] = React.useState({
    email: "",
    password: "",
  });
  const [buttonDisabled, setButtonDisabled] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [loginError, setLoginError] = React.useState("");

  useEffect(() => {
    if (user.email && user.password) {
      setButtonDisabled(false);
    } else {
      setButtonDisabled(true);
    }
  }, [user]);

  // Function to handle login
  const onLogin = async () => {
    try {
      // Set loading state to true before making the API call
      setLoading(true);
      setLoginError("");

      // Make a POST request to the login API endpoint with user credentials
      const response = await axios.post("/api/users/login", user);
      console.log("Login successful:", response.data);

      // Redirect to the profile page after successful login
      router.push("/profile");
    } catch (error: any) {
      console.error("Error during login:", error);
      setLoginError(
        error.response?.data?.message ||
          "We could not log you in. Please check your details and try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-4xl font-bold mb-4">Login Page</h1>

      <label htmlFor="email" className="mb-2">
        Email:
      </label>
      <input
        type="text"
        id="email"
        // set the value of the input to the email state and update the state on change
        value={user.email}
        onChange={(e) => setUser({ ...user, email: e.target.value })}
        className="border border-gray-300 rounded px-2 py-1 mb-4"
        placeholder="Enter your email"
      />

      <label htmlFor="password" className="mb-2">
        Password:
      </label>
      <input
        type="text"
        id="password"
        // set the value of the input to the password state and update the state on change
        value={user.password}
        onChange={(e) => setUser({ ...user, password: e.target.value })}
        className="border border-gray-300 rounded px-2 py-1 mb-4"
        placeholder="Enter your password"
      />
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        // when the button is clicked, call the onLogin function
        onClick={onLogin}
      >
        Login
      </button>
      {loginError && (
        <p className="mt-4 max-w-sm text-center text-red-600" role="alert">
          {loginError}
        </p>
      )}
      <Link href="/signup" className="mt-4 text-blue-500 hover:underline">
        Sign up here
      </Link>
    </div>
  );
}
