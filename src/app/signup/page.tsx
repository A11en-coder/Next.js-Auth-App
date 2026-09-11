"use client";
import React, { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "react-hot-toast";

export default function SignupPage() {
  const router = useRouter();
  const [user, setUser] = React.useState({
    username: "",
    email: "",
    password: "",
  });

  const [buttonDisabled, setButtonDisabled] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const onSignup = async () => {
    // create a try-catch block to handle the signup process
    try {
        setLoading(true);
        const response = await axios.post("/api/users/signup", user); 
        router.push("/login");
        toast.success("Signup successful! Please login.");
    } catch (error: any) {
      console.log("Error during signup:", error);
      toast.error("Something went wrong during signup");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user.username && user.email && user.password) {
      setButtonDisabled(false);
    } else {
      setButtonDisabled(true);
    }
  }, [user]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-4xl font-bold mb-4">
        {loading ? "Loading..." : "Signup Page"}
      </h1>
      <label htmlFor="username" className="mb-2">
        Username:
      </label>
      <input
        type="text"
        id="username"
        value={user.username}
        onChange={(e) => setUser({ ...user, username: e.target.value })}
        className="border border-gray-300 rounded px-2 py-1 mb-4"
        placeholder="Enter your username"
      />

      <label htmlFor="email" className="mb-2">
        Email:
      </label>
      <input
        type="text"
        id="email"
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
        value={user.password}
        onChange={(e) => setUser({ ...user, password: e.target.value })}
        className="border border-gray-300 rounded px-2 py-1 mb-4"
        placeholder="Enter your password"
      />
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        onClick={onSignup}
      >
        {buttonDisabled ? "Please fill all fields" : "Signup"}
      </button>
      <Link href="/login" className="mt-4 text-blue-500 hover:underline">
        Already have an account? Login
      </Link>
    </div>
  );
}
