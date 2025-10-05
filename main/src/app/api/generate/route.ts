import type { NextRequest } from "next/server";
// NOTE: your util exports `createClient`, not `createServerClient`
import { createClient } from "@/utils/supabase/server";
import { openai } from "@/utils/openai";

export async function POST(req: NextRequest) {
  try {
    // 1) Auth
    const supabase = createClient();
    const {
      data: { user },
      error: userErr,
    } = await supabase.auth.getUser();

    if (userErr) {
      return Response.json({ error: userErr.message }, { status: 401 });
    }
    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2) Parse input
    const body = await req.json();
    const jobTitle = (body?.jobTitle ?? "").trim();
    const experience = Number(body?.experience ?? 0);
    const skills = (body?.skills ?? "").trim();

    if (!jobTitle || !skills || Number.isNaN(experience)) {
      return Response.json({ error: "Missing fields" }, { status: 400 });
    }

    // 3) Check credits
    const { data: profile, error: profErr } = await supabase
      .from("profiles")
      .select("credits")
      .eq("id", user.id)
      .single();

    if (profErr) {
      return Response.json({ error: profErr.message }, { status: 500 });
    }
    if (!profile || profile.credits <= 0) {
      return Response.json({ error: "No credits left" }, { status: 400 });
    }

    // 4) Call OpenAI (Responses API, typed safely via `output_text`)
    const prompt = `You are an expert resume writer. Generate a concise, high-impact resume summary (80–120 words) tailored for the following profile.
Role: ${jobTitle}
Experience: ${experience} years
Key Skills: ${skills}

Constraints:
- One short paragraph.
- No first-person.
- Prefer measurable outcomes (%, $, time saved) when plausible.
- ATS-friendly language.`;

    const completion = await openai.responses.create({
      model: "gpt-4.1-mini",
      input: prompt,
      temperature: 0.7,
    });

    const text = (completion.output_text ?? "").trim(); 
    if (!text) {
      return Response.json({ error: "No content generated" }, { status: 502 });
    }

    // 5) Deduct a credit (simple update; we can switch to RPC later)
    const { error: updErr } = await supabase
      .from("profiles")
      .update({ credits: profile.credits - 1 })
      .eq("id", user.id);

    if (updErr) {
      // If deduct fails, still return text but signal the issue (you can decide to block instead)
      return Response.json(
        { text, warning: "Generated OK, but failed to deduct credit." },
        { status: 200 }
      );
    }

    // 6) Return
    return Response.json({ text });
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Server error (unknown)";
    console.error("[/api/generate] error:", message);
    return Response.json({ error: message }, { status: 500 });
  }
}
