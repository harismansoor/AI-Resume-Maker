import { login, signup } from "./actions";

export default function LoginPage() {
  return (
    <main className="mx-auto max-w-sm p-8 space-y-8">
      <h1 className="text-2xl font-semibold">Sign in / Sign up</h1>

      {/* Login form */}
      <form action={login} className="space-y-4">
        <input
          className="w-full rounded border p-2"
          type="email"
          name="email"
          placeholder="you@example.com"
          required
        />
        <input
          className="w-full rounded border p-2"
          type="password"
          name="password"
          placeholder="Your password"
          minLength={6}
          required
        />
        <button className="rounded bg-black px-3 py-2 text-white">
          Log in
        </button>
      </form>

      {/* Sign-up form */}
      <form action={signup} className="space-y-4">
        <input
          className="w-full rounded border p-2"
          type="email"
          name="email"
          placeholder="you@example.com"
          required
        />
        <input
          className="w-full rounded border p-2"
          type="password"
          name="password"
          placeholder="Choose a password"
          minLength={6}
          required
        />
        <button className="rounded border px-3 py-2">Sign up</button>
      </form>
    </main>
  );
}
