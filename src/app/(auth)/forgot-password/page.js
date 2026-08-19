"use client";

import Link from "next/link";

export default function ForgotPasswordPage() {
  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-6">
      <Link href="/" className="text-xl font-bold tracking-tight">
        OMNI<span className="text-accent">ERP</span>
      </Link>
      <div className="mt-10 rounded-lg border border-line bg-panel p-7">
        <p className="text-xs font-semibold uppercase tracking-[.16em] text-accent">
          Account access
        </p>
        <h1 className="mt-3 text-2xl font-bold">Reset your password</h1>
        <p className="mt-2 text-sm text-muted">
          Enter your email and we will prepare a recovery link.
        </p>
        <form
          className="mt-7 space-y-4"
          onSubmit={(event) => event.preventDefault()}
        >
          <label className="block text-sm font-semibold">
            Email address
            <input
              required
              type="email"
              className="mt-2 w-full rounded-md border border-line px-3 py-2.5 font-normal outline-none focus:border-accent"
              placeholder="you@example.com"
            />
          </label>
          <button className="w-full rounded-md bg-accent px-4 py-2.5 text-sm font-semibold text-white">
            Send recovery link
          </button>
        </form>
        <Link
          href="/login"
          className="mt-5 block text-center text-sm font-semibold text-accent"
        >
          Back to sign in
        </Link>
      </div>
    </div>
  );
}
