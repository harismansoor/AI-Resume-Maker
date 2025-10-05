import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

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

      <div className="space-x-2">
        <a href="/generate" className="rounded bg-black text-white px-3 py-2">
          Generate
        </a>
        <form action="/logout" method="post" className="inline">
          <button className="rounded border px-3 py-2">Log out</button>
        </form>
      </div>
    </main>
  );
}
