import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

export default async function Dashboard() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) redirect("/login");

  return (
    <main className="p-8">
      <h1 className="text-2xl font-semibold mb-2">Dashboard</h1>
      <p>Welcome, {data.user.email}</p>
    </main>
  );
}
