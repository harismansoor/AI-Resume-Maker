"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AuthLayout from "@/components/auth/auth-layout";
import AuthCard from "@/components/auth/auth-card";
import OAuthButtons from "@/components/auth/oauth-buttons";
import { EmailField, PasswordField } from "@/components/auth/form-fields";

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  async function doSignup(e: React.FormEvent) {
    e.preventDefault();
    setPending(true);
    setError(null);

    try {
      if (supabaseUrl && supabaseKey) {
        const { createClient } = await import("@supabase/supabase-js");
        const sb = createClient(supabaseUrl, supabaseKey);
        const { error } = await sb.auth.signUp({ email, password });
        if (error) throw error;

        // Optional: seed 5 credits on first login via DB trigger or API call here.
      }
      router.push("/dashboard");
    } catch (err: unknown) {
      // Narrow the unknown error safely instead of using `any`.
      if (err instanceof Error) {
        setError(err.message ?? "Signup failed");
      } else if (typeof err === "string") {
        setError(err);
      } else {
        setError("Signup failed");
      }
    } finally {
      setPending(false);
    }
  }

  const signupWithProvider = (provider: "google" | "github") => async () => {
    try {
      if (!(supabaseUrl && supabaseKey)) {
        return router.push("/dashboard"); // demo
      }
      const { createClient } = await import("@supabase/supabase-js");
      const sb = createClient(supabaseUrl, supabaseKey);
      const { data, error } = await sb.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo:
            typeof window !== "undefined"
              ? `${window.location.origin}/dashboard`
              : undefined,
        },
      });
      if (error) throw error;
      if (!data?.url) router.push("/dashboard");
    } catch (err: unknown) {
      if (err instanceof Error) console.error(err);
      else console.error(err);
    }
  };

  return (
    <AuthLayout
      headline="Create your account — start with 5 free credits."
      subline="Import, generate, and export in minutes."
    >
      <AuthCard
        title="Sign up"
        subtitle="It’s free to get started"
        footer={
          <p>
            Already have an account?{" "}
            <a
              className="font-medium text-black underline-offset-2 hover:underline"
              href="/login"
            >
              Log in
            </a>
          </p>
        }
      >
        <OAuthButtons
          onGoogle={signupWithProvider("google")}
          onGithub={signupWithProvider("github")}
        />
        <div className="relative py-2 text-center text-xs text-slate-500">
          <span className="bg-white px-2">or</span>
          <div className="absolute left-0 right-0 top-1/2 -z-10 h-px -translate-y-1/2 bg-slate-200" />
        </div>

        <form onSubmit={doSignup} className="space-y-3">
          <EmailField value={email} onChange={setEmail} />
          <PasswordField
            value={password}
            onChange={setPassword}
            label="Create a password"
          />
          {error ? <p className="text-sm text-red-600">{error}</p> : null}
          <button
            type="submit"
            disabled={pending}
            className="mt-1 w-full rounded-lg bg-black px-3 py-2 text-sm font-medium text-white disabled:opacity-60"
          >
            {pending ? "Creating account…" : "Create account"}
          </button>
        </form>

        <p className="mt-3 text-xs text-slate-600">
          By creating an account you agree to our{" "}
          <a href="#" className="underline">
            Terms
          </a>{" "}
          and{" "}
          <a href="#" className="underline">
            Privacy
          </a>
          .
        </p>
      </AuthCard>
    </AuthLayout>
  );
}
