import type { NextRequest } from "next/server";
import htmlToDocx from "html-to-docx";

export const runtime = "nodejs"; // ensure Node runtime on Vercel

export async function POST(req: NextRequest) {
  try {
    const { html, filename } = await req.json();
    if (!html) {
      return new Response(JSON.stringify({ error: "Missing HTML" }), { status: 400 });
    }
    // @ts-expect-error: html-to-docx type definitions are outdated
    const buffer = await htmlToDocx(html, {
      pageSize: { width: 11906, height: 16838 }, // A4 (twips)
      // You can tweak margins, footer, etc. later
    });

    const safe = (filename || "resume").replace(/[^a-z0-9-_]+/gi, "_");
    return new Response(buffer, {
      status: 200,
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "Content-Disposition": `attachment; filename="${safe}.docx"`,
      },
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Export error";
    return new Response(JSON.stringify({ error: msg }), { status: 500 });
  }
}
