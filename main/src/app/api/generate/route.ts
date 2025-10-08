import type { NextRequest } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { openai } from "@/utils/openai";

export async function POST(req: NextRequest) {
  try {
    const supabase = createClient();
    const { data: { user }, error: userErr } = await supabase.auth.getUser();
    if (userErr || !user) 
      return Response.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const jobTitle = (body?.jobTitle ?? "").trim();
    const experience = Number(body?.experience ?? 0);
    const skills = (body?.skills ?? "").trim();
    if (!jobTitle || !skills || Number.isNaN(experience)) {
      return Response.json({ error: "Missing fields" }, { status: 400 });
    }

    // 🧠 Skip credit deduction if admin
    if (user.email === "harismansoor0.0@gmail.com") {
      console.log("Admin detected — skipping credit deduction.");
    } else {
      // 🚦 ATOMIC: decrement credit first; if null, no credits left
      const { data: dec, error: decErr } = await supabase.rpc("decrement_credit");
      if (decErr) return Response.json({ error: decErr.message }, { status: 500 });
      if (dec === null) return Response.json({ error: "No credits left" }, { status: 400 });
    }

    // Call OpenAI
    const prompt = `You are an expert resume writer. Generate a concise, high-impact resume summary (80–120 words) ...
Role: ${jobTitle}
Experience: ${experience} years
Key Skills: ${skills}
Constraints:
- One short paragraph.
- No first-person.
- Prefer measurable outcomes.
- ATS-friendly language.`;

    try {
      const completion = await openai.responses.create({
        model: "gpt-4.1-mini",
        input: prompt,
        temperature: 0.7,
      });

      const text = (completion.output_text ?? "").trim();
      if (!text) {
        // refund on empty output
        await supabase.rpc("refund_credit");
        return Response.json({ error: "No content generated" }, { status: 502 });
      }

      return Response.json({ text });
    } catch (e) {
      // refund on OpenAI failure
      await supabase.rpc("refund_credit");
      const message = e instanceof Error ? e.message : "OpenAI error";
      return Response.json({ error: message }, { status: 502 });
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : "Server error";
    return Response.json({ error: message }, { status: 500 });
  }
}