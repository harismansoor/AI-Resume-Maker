import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import ResumeBuilderClient from "@/components/resume/ResumeBuilderClient";

export default async function ResumePage() {
  const supabase = createClient();
  const { data: u } = await supabase.auth.getUser();
  if (!u?.user) redirect("/login");

  return (
    <main className="mx-auto max-w-6xl p-6 space-y-6">
      <h1 className="text-2xl font-semibold">AI Resume Builder</h1>
      <ResumeBuilderClient />
    </main>
  );
}
