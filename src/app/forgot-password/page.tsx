"use client";

import React, { FormEvent, useState } from "react";
import axios from "axios";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setMessage("");
    setError("");

    try {
      await axios.post("/api/users/forgot-password", { email });
      setMessage(
        "A verification email has been sent if this email is registered.",
      );
    } catch (requestError: any) {
      setError(
        requestError.response?.data?.message ||
          "We could not send the verification email. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-2">
      <h1 className="mb-4 text-4xl font-bold">Forgot Password Page</h1>

      <form onSubmit={onSubmit} className="flex flex-col items-center">
        <label htmlFor="email" className="mb-2">
          Email:
        </label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="mb-4 rounded border border-gray-300 px-2 py-1"
          placeholder="Enter your email"
          required
        />
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting ? "Sending..." : "Send verification emai"}
        </button>
      </form>

      {message && (
        <p className="mt-4 max-w-sm text-center text-green-600" role="status">
          {message}
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
