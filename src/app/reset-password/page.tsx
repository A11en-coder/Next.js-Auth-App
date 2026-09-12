"use client";

import axios from "axios";
import React, { FormEvent, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsSubmitting(true);

    try {
      await axios.post("/api/users/reset-password", {
        token,
        password,
        confirmPassword,
      });
      router.push("/login");
    } catch (requestError: any) {
      setError(
        requestError.response?.data?.message ||
          "We could not reset your password. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-2">
      <h1 className="mb-4 text-4xl font-bold">Password Reset Page</h1>

      <form onSubmit={onSubmit} className="flex flex-col items-center">
        <label htmlFor="password" className="mb-2">
          New password:
        </label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="mb-4 rounded border border-gray-300 px-2 py-1"
          placeholder="Enter your new password"
          minLength={8}
          required
        />

        <label htmlFor="confirmPassword" className="mb-2">
          Confirm password:
        </label>
        <input
          type="password"
          id="confirmPassword"
          value={confirmPassword}
          onChange={(event) => setConfirmPassword(event.target.value)}
          className="mb-4 rounded border border-gray-300 px-2 py-1"
          placeholder="Confirm your new password"
          minLength={8}
          required
        />

        <button
          type="submit"
          disabled={isSubmitting || !token}
          className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting ? "Resetting..." : "Reset password"}
        </button>
      </form>

      {!token && (
        <p className="mt-4 max-w-sm text-center text-red-600" role="alert">
          This reset link is missing its token. Please request a new one.
        </p>
      )}
      {error && (
        <p className="mt-4 max-w-sm text-center text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
