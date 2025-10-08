import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import GenerateClient from "@/components/resume/GenerateClient";

export default async function Dashboard() {
  const supabase = createClient();

  // 1) require auth
  const { data: u, error } = await supabase.auth.getUser();
  if (error || !u?.user) redirect("/login");
  const user = u.user;

  // 2) fetch credits from profiles
  const { data: profile } = await supabase
    .from("profiles")
    .select("email, credits")
    .eq("id", user.id)
    .single();

  return (
    <main className="p-8 space-y-6">
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      <p>Welcome, {profile?.email ?? user.email}</p>

      <div className="rounded border p-4 inline-block">
        <div className="text-sm opacity-70">Credits</div>
        <div className="text-3xl font-bold">{profile?.credits ?? 0}</div>
      </div>

      <a
        href="/resume"
        className="inline-block rounded bg-white/10 px-3 py-2 hover:bg-white/20"
      >
        Open Resume Builder
      </a>

      {/* New generator UI */}
      <GenerateClient />

      <div>
        <form action="/logout" method="POST">
          <button
            type="submit"
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
          >
            Log out
          </button>
        </form>
      </div>
    </main>
  );
}
