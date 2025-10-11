import { NextRequest } from "next/server";
import { createClient } from "@/utils/supabase/server";

/**
 * POST /api/resumes
 * body: { title?: string; template: string; sections: string[]; data: any }
 */
export async function POST(req: NextRequest) {
  const supabase = createClient();
  const { data: u, error: userErr } = await supabase.auth.getUser();
  if (userErr || !u?.user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  const user = u.user;

  const body = await req.json();
  const title = (body?.title ?? "Untitled Resume").toString();
  const template = (body?.template ?? "minimal").toString();
  const sections = Array.isArray(body?.sections) ? body.sections : [];
  const data = body?.data;

  if (!data) {
    return Response.json({ error: "Missing data" }, { status: 400 });
  }

  const { data: inserted, error } = await supabase
    .from("resumes")
    .insert({
      user_id: user.id,
      title,
      template,
      sections,
      data,
    })
    .select("id")
    .single();

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json({ id: inserted.id }, { status: 200 });
}
