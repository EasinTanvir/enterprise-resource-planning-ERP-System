"use client";

import Link from "next/link";

const LoginPage = () => (
  <div className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-6">
    <Link href="/" className="text-xl font-bold tracking-tight">
      OMNI<span className="text-accent">ERP</span>
    </Link>
    <div className="mt-10 rounded-lg border border-line bg-panel p-7">
      <p className="text-xs font-semibold uppercase tracking-[.16em] text-accent">
        Welcome back
      </p>
      <h1 className="mt-3 text-2xl font-bold">Sign in to your workspace</h1>
      <p className="mt-2 text-sm text-muted">
        Use your organization account to continue.
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
        <label className="block text-sm font-semibold">
          Password
          <input
            required
            type="password"
            className="mt-2 w-full rounded-md border border-line px-3 py-2.5 font-normal outline-none focus:border-accent"
            placeholder="Your password"
          />
        </label>
        <div className="flex justify-end">
          <Link
            href="/forgot-password"
            className="text-xs font-semibold text-accent"
          >
            Forgot password?
          </Link>
        </div>
        <button className="w-full rounded-md bg-accent px-4 py-2.5 text-sm font-semibold text-white">
          Sign in
        </button>
      </form>
      <p className="mt-5 text-center text-sm text-muted">
        New to OmniERP?{" "}
        <Link href="/register" className="font-semibold text-accent">
          Create an account
        </Link>
      </p>
    </div>
  </div>
);

export default LoginPage;
