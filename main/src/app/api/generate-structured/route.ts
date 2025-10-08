import type { NextRequest } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { openai } from "@/utils/openai";
import type { ResumeData, ResumeSectionId } from "@/types/resume";

export async function POST(req: NextRequest) {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const {
      name, email, phone, location, jobTitle, experienceYears,
      skills, education, achievements, projects,
      // optional: section controls
      includeSections,
    } = body as {
      name: string; email?: string; phone?: string; location?: string;
      jobTitle: string; experienceYears: number;
      skills: string; education?: string; achievements?: string; projects?: string;
      includeSections?: ResumeSectionId[];
    };

    // admin free; others decrement
    if (user.email !== "harismansoor0.0@gmail.com") {
      const { data: dec, error: decErr } = await supabase.rpc("decrement_credit");
      if (decErr) return Response.json({ error: decErr.message }, { status: 500 });
      if (dec === null) return Response.json({ error: "No credits left" }, { status: 400 });
    }

    const prompt = `
Return ONLY valid JSON (no backticks).
You are a professional resume writer. Produce a JSON object matching this TypeScript type:
${/* keep it short for token cost */ ""}
{
  "name": string,
  "role": string,
  "contact": { "email"?: string, "phone"?: string, "location"?: string, "links"?: string[] },
  "summary"?: string,
  "skills"?: string[],
  "experience"?: Array<{ "title"?: string, "company"?: string, "location"?: string, "startDate"?: string, "endDate"?: string, "bullets"?: string[] }>,
  "education"?: Array<{ "degree"?: string, "school"?: string, "year"?: string, "details"?: string[] }>,
  "projects"?: Array<{ "title"?: string, "company"?: string, "location"?: string, "startDate"?: string, "endDate"?: string, "bullets"?: string[] }>,
  "achievements"?: string[],
  "certifications"?: string[],
  "languages"?: string[]
}

Use the following user info:
- Name: ${name}
- Role: ${jobTitle}
- Total Experience: ${experienceYears} years
- Contact: ${email ?? ""} | ${phone ?? ""} | ${location ?? ""}
- Skills (raw): ${skills}
- Education (raw): ${education ?? ""}
- Achievements (raw): ${achievements ?? ""}
- Projects (raw): ${projects ?? ""}
- Include only these sections if provided: ${includeSections?.join(", ") ?? "all common sections"}

Guidelines:
- Summary: 3–5 lines, impact & metrics.
- Skills: 8–12 strongest keywords.
- Experience: 2–3 roles, each 3–5 bullets, quantified.
- Education: concise.
- Projects/Achievements: include if signal is good.
- Dates short like "2022—Present".
`;

    try {
      const completion = await openai.responses.create({
        model: "gpt-4.1-mini",
        input: prompt,
        temperature: 0.4,
      });

      const raw = (completion.output_text ?? "").trim();

      // Parse JSON safely
      let data: ResumeData | null = null;
      try {
        data = JSON.parse(raw) as ResumeData;
      } catch {
        // refund for non-admin on parse failure
        if (user.email !== "harismansoor0.0@gmail.com") await supabase.rpc("refund_credit");
        return Response.json({ error: "Bad JSON from model" }, { status: 502 });
      }

      if (!data?.name || !data?.role) {
        if (user.email !== "harismansoor0.0@gmail.com") await supabase.rpc("refund_credit");
        return Response.json({ error: "Incomplete data" }, { status: 502 });
      }

      return Response.json({ data });
    } catch (e) {
      if (user.email !== "harismansoor0.0@gmail.com") await supabase.rpc("refund_credit");
      const msg = e instanceof Error ? e.message : "OpenAI error";
      return Response.json({ error: msg }, { status: 502 });
    }
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Server error";
    return Response.json({ error: msg }, { status: 500 });
  }
}
