export async function GET() {
    return Response.json({
      url: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'set' : 'missing',
      key: process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ? 'set' : 'missing',
    })
  }