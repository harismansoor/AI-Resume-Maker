// src/app/api/env-ok/route.ts
export async function GET() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnon = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  const openaiKey = process.env.OPENAI_API_KEY;

  return Response.json({
    supabaseUrl: supabaseUrl ? "✅ set" : "❌ missing",
    supabaseAnon: supabaseAnon ? "✅ set" : "❌ missing",
    openaiKey: openaiKey
      ? `✅ set (${openaiKey.slice(0, 4)}...${openaiKey.slice(-4)})`
      : "❌ missing",
  });
}