"use client";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const router = useRouter();

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
    </div>
  );
}
