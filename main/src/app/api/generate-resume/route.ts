import type { NextRequest } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { openai } from "@/utils/openai";

export async function POST(req: NextRequest) {
  try {
    const supabase = createClient();
    const {
      data: { user },
      error: userErr,
    } = await supabase.auth.getUser();
    if (userErr || !user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const name = (body?.name ?? "").trim();
    const email = (body?.email ?? "").trim();
    const phone = (body?.phone ?? "").trim();
    const location = (body?.location ?? "").trim();
    const jobTitle = (body?.jobTitle ?? "").trim();
    const experienceYears = Number(body?.experienceYears ?? 0);
    const skills = (body?.skills ?? "").trim();              // comma or line-separated
    const education = (body?.education ?? "").trim();        // freeform
    const achievements = (body?.achievements ?? "").trim();  // freeform
    const projects = (body?.projects ?? "").trim();          // freeform

    if (!name || !jobTitle || !skills) {
      return Response.json({ error: "Missing required fields" }, { status: 400 });
    }

    // 1) Atomic credit decrement (RPC created earlier)
    const { data: dec, error: decErr } = await supabase.rpc("decrement_credit");
    if (decErr) return Response.json({ error: decErr.message }, { status: 500 });
    if (dec === null) return Response.json({ error: "No credits left" }, { status: 400 });

    // 2) Build prompt for a full resume (HTML with light inline CSS)
    const prompt = `
You are a professional resume writer and ATS expert. Create a complete, modern resume in clean HTML with minimal inline CSS (no external fonts or scripts).
Use semantic sections and keep it A4-friendly. Do not include <html> or <head>, just the core <div id="resume">...</div>.

User details:
- Name: ${name}
- Email: ${email}
- Phone: ${phone}
- Location: ${location}
- Target Role: ${jobTitle}
- Total Experience: ${experienceYears} years
- Key Skills: ${skills}
- Education (raw): ${education}
- Achievements (raw): ${achievements}
- Projects (raw): ${projects}

Requirements:
- Header with name, role, and compact contact line (email • phone • location).
- "Professional Summary": 3–5 concise lines, action- and impact-oriented.
- "Key Skills": short tags or comma list.
- "Work Experience": 2–3 roles if possible, bullets with quantified outcomes (perf %, time saved, $ impact).
- "Education": clean lines (degree, institution, year).
- Optional "Projects" and "Achievements" if data is provided.
- ATS-friendly language and consistent tense.
- Keep total length ~1–1.5 pages.

Return ONLY the HTML snippet starting with <div id="resume"> and nothing else.
Apply tasteful minimal styling inline (system font stack, clear headings, spacing, subtle borders).
`;

    try {
      const completion = await openai.responses.create({
        model: "gpt-4.1-mini",
        input: prompt,
        temperature: 0.6,
      });

      const html = (completion.output_text ?? "").trim();

      if (!html || !html.includes("<div") || !html.includes("</div>")) {
        await supabase.rpc("refund_credit");
        return Response.json({ error: "Generation failed. Please try again." }, { status: 502 });
      }

      return Response.json({ html });
    } catch (e) {
      await supabase.rpc("refund_credit");
      const message = e instanceof Error ? e.message : "OpenAI error";
      return Response.json({ error: message }, { status: 502 });
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : "Server error";
    return Response.json({ error: message }, { status: 500 });
  }
}
