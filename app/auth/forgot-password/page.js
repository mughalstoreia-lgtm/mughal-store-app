"use client";

import { useState } from "react";
import Link from "next/link";
import { forgotPassword } from "@/lib/api";
import Button from "@/components/Button";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");

    if (!email) {
      setError("Please enter your email address");
      return;
    }

    setLoading(true);
    try {
      const res = await forgotPassword(email);
      setSuccessMsg(res.message || "Password reset instructions sent to your email.");
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto flex min-h-[calc(100vh-8rem)] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md rounded-2xl border border-surface-border bg-surface-card p-6 md:p-8 shadow-xl flex flex-col justify-center">
        <h1 className="text-2xl font-bold text-content-main text-center mb-1">
          Forgot Password
        </h1>
        <p className="text-center text-sm text-content-sub mb-6">
          Enter your email and we&apos;ll send you instructions to reset your password.
        </p>

        {error && (
          <div className="mb-4 rounded-lg bg-accent-danger-soft px-4 py-3 text-sm text-accent-danger text-center">
            {error}
          </div>
        )}

        {successMsg && (
          <div className="mb-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20 px-4 py-3 text-sm text-emerald-400 text-center">
            {successMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-content-sub mb-1.5">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full rounded-lg border border-surface-border bg-surface-base px-4 py-2.5 text-sm text-content-main focus:border-brand-primary focus:outline-none focus:ring-1 focus:ring-brand-primary transition-colors"
              required
            />
          </div>

          <Button type="submit" loading={loading} className="w-full pt-3">
            Send Reset Link
          </Button>

          <p className="text-center text-sm text-content-sub pt-2">
            Remembered your password?{" "}
            <Link href="/auth/login" className="text-brand-light font-medium hover:underline">
              Back to Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}