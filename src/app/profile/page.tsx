"use client";
import axios from "axios";
import React, { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const router = useRouter();
  const [data, setData] = React.useState(null);

  const logout = async () => {
    try {
      const response = await axios.get("/api/users/logout");
      if (response.status === 200) {
        // Redirect to the login page after successful logout
        router.push("/login");
      }
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const getUserDetails = async () => {
    try {
      const response = await axios.get("/api/users/me");
      if (response.status === 200) {
        const user = response.data.user;
        console.log("User details:", user);

        // extract the username from the user object and set it in state
        setData(user.username);
      }
    } catch (error) {
      console.error("Failed to fetch user details:", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-4xl font-bold mb-4">Profile Page</h1>

      <p>Welcome to your profile!</p>
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded mt-4"
        onClick={logout}
      >
        Logout
      </button>
      <button
        className="bg-green-500 text-white px-4 py-2 rounded mt-4"
        onClick={getUserDetails}
      >
        Get User Details
      </button>
      {data && <p className="mt-4">Username: {data}</p>}

      <Link href={`/profile/${data}`} className="mt-4 text-blue-500">
        Go to Profile Page
      </Link>
    </div>
  );
}
