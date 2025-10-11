import "server-only";
import type { NextRequest } from "next/server";
import mammoth from "mammoth";
import { createClient } from "@/utils/supabase/server";
import { openai } from "@/utils/openai";
import type { ResumeData } from "@/types/resume";

export const runtime = "nodejs"; // ensure Node runtime (needed for pdf-parse)

// ---- Types & type guards for pdf-parse (avoid `any`) ----
type PdfParseResult = { text?: string };
type PdfParseFn = (data: Buffer | Uint8Array) => Promise<PdfParseResult>;

function isPdfParseFn(x: unknown): x is PdfParseFn {
  return typeof x === "function";
}
function getPdfParse(mod: unknown): PdfParseFn {
  // CommonJS: the module itself is the function
  if (isPdfParseFn(mod)) return mod;
  // ESM default export: { default: fn }
  if (typeof mod === "object" && mod !== null && "default" in mod) {
    const d = (mod as { default: unknown }).default;
    if (isPdfParseFn(d)) return d;
  }
  throw new Error("Invalid pdf-parse module shape");
}

export async function POST(req: NextRequest) {
  try {
    // auth
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

    const form = await req.formData();
    const file = form.get("file");
    if (!file || !(file instanceof Blob)) {
      return Response.json({ error: "No file uploaded" }, { status: 400 });
    }

    const f = file as File;
    const arrayBuffer = await f.arrayBuffer();
    const bytes = Buffer.from(arrayBuffer);
    const mime = f.type;
    const name = f.name?.toLowerCase() ?? "";

    let rawText = "";

    // ---- DOCX ----
    if (mime.includes("word") || name.endsWith(".docx")) {
      const result = await mammoth.convertToHtml({ buffer: bytes });
      const html = result.value ?? "";
      rawText = stripHtml(html);
    }
    // ---- PDF ----
    else if (mime.includes("pdf") || name.endsWith(".pdf")) {
      const mod = await import("pdf-parse");
      const pdfParse = getPdfParse(mod);
      const parsed = await pdfParse(bytes);
      rawText = (parsed.text ?? "").trim();
    } else {
      return Response.json(
        { error: "Unsupported file type. Upload .docx or .pdf" },
        { status: 400 }
      );
    }

    if (!rawText || rawText.length < 40) {
      return Response.json(
        { error: "Could not read content from file" },
        { status: 400 }
      );
    }

    // Owner bypass for credits
    if (user.email !== "harismansoor0.0@gmail.com") {
      const { data: dec, error: decErr } = await supabase.rpc("decrement_credit");
      if (decErr) return Response.json({ error: decErr.message }, { status: 500 });
      if (dec === null) return Response.json({ error: "No credits left" }, { status: 400 });
    }

    // Guard tokens: trim very long files
    const MAX = 100_000;
    const snippet = rawText.slice(0, MAX);

    const prompt = `
Return ONLY valid JSON (no backticks). Extract a structured resume from the provided raw text into this shape:

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

Rules:
- Infer missing fields sensibly.
- Consolidate duplicate sections.
- Bullets concise and quantified where possible.
- Dates like "2022—Present".
- Skills as a unique list (8–15).
- English output.

Raw resume text:
---
${snippet}
---`;

    let data: ResumeData | null = null;
    try {
      const completion = await openai.responses.create({
        model: "gpt-4.1-mini",
        input: prompt,
        temperature: 0.2,
      });
      const rawJson = (completion.output_text ?? "").trim();
      data = JSON.parse(rawJson) as ResumeData;
    } catch (e) {
      if (user.email !== "harismansoor0.0@gmail.com") {
        await supabase.rpc("refund_credit");
      }
      const msg = e instanceof Error ? e.message : "OpenAI parse error";
      return Response.json({ error: msg }, { status: 502 });
    }

    if (!data?.name || !data?.role) {
      if (user.email !== "harismansoor0.0@gmail.com") {
        await supabase.rpc("refund_credit");
      }
      return Response.json(
        { error: "Could not map to resume structure" },
        { status: 502 }
      );
    }

    return Response.json({ data });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Server error";
    return Response.json({ error: msg }, { status: 500 });
  }
}

function stripHtml(html: string) {
  return html
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<\/(p|div|li|h\d)>/gi, "$&\n")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+\n/g, "\n")
    .replace(/[ \t]{2,}/g, " ")
    .trim();
}
