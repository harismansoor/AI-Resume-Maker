import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import OpenAI from 'openai'

type Tone = 'Professional' | 'Academic' | 'Creative' | 'Friendly'
type Style = 'Concise' | 'Balanced' | 'Detailed'

type GenerateBody = {
  prompt: string
  tone?: Tone
  style?: Style
}

const DEFAULT_TONE: Tone = 'Professional'
const DEFAULT_STYLE: Style = 'Balanced'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! })

export async function POST(req: NextRequest) {
  try {
    const supabase = createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = (await req.json()) as GenerateBody
    const { prompt, tone = DEFAULT_TONE, style = DEFAULT_STYLE } = body
    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json({ error: 'Missing prompt' }, { status: 400 })
    }

    // decrement credit unless admin bypass
    const isBypass = user.email === 'harismansoor0.0@gmail.com'
    if (!isBypass) {
      const { data: dec, error: decErr } = await supabase.rpc('decrement_credit')
      if (decErr || dec === null) {
        return NextResponse.json({ error: 'No credits left' }, { status: 402 })
      }
    }

    // Build the system instructions using tone/style
    const toneHint =
      tone === 'Professional'
        ? 'Use straightforward, business-appropriate language.'
        : tone === 'Academic'
        ? 'Use formal, scholarly language where appropriate.'
        : tone === 'Creative'
        ? 'Use vivid but still resume-appropriate language.'
        : 'Use warm, approachable language while staying professional.'

    const styleHint =
      style === 'Concise'
        ? 'Be concise. Prefer short bullet points and tight phrasing.'
        : style === 'Detailed'
        ? 'Be descriptive. Expand bullets with concrete results and context.'
        : 'Balance brevity and detail. Keep bullets informative but focused.'

    const system = [
      'You generate strictly VALID JSON for a resume object named ResumeData.',
      'Do not include Markdown, code fences, or commentary—JSON only.',
      'Make content ATS-friendly (verbs, impact, tech keywords).',
      `Tone: ${tone}. ${toneHint}`,
      `Style: ${style}. ${styleHint}`,
      'Prefer measurable outcomes (%, $, time saved) when inferring impact.',
    ].join(' ')

    const userMsg = [
      'User prompt:',
      prompt,
      '',
      'Return JSON with keys where available:',
      `{
        "name": string,
        "contact": { "email"?: string, "phone"?: string, "location"?: string, "website"?: string, "linkedin"?: string, "github"?: string },
        "summary"?: string,
        "skills"?: string[],
        "experience"?: [{ "company": string, "role"?: string, "start"?: string, "end"?: string, "bullets"?: string[] }],
        "projects"?: [{ "name": string, "link"?: string, "bullets"?: string[] }],
        "education"?: [{ "school": string, "degree"?: string, "start"?: string, "end"?: string, "details"?: string }]
      }`,
    ].join('\n')

    const resp = await openai.responses.create({
      model: 'gpt-4.1-mini',
      input: [
        { role: 'system', content: system },
        { role: 'user', content: userMsg },
      ],
    })

    const text = typeof resp.output_text === 'string' ? resp.output_text : ''
    // Safe JSON extraction
    const start = text.indexOf('{')
    const end = text.lastIndexOf('}')
    if (start === -1 || end === -1 || end <= start) {
      if (!isBypass) await supabase.rpc('refund_credit')
      return NextResponse.json({ error: 'Invalid model output' }, { status: 500 })
    }
    const raw = text.slice(start, end + 1)
    let resume
    try {
      resume = JSON.parse(raw)
    } catch {
      if (!isBypass) await supabase.rpc('refund_credit')
      return NextResponse.json({ error: 'Could not parse JSON' }, { status: 500 })
    }

    return NextResponse.json({ resume }, { status: 200 })
  } catch (e: unknown) {
    // best effort refund
    try {
      const supabase = createClient()
      await supabase.rpc('refund_credit')
    } catch {}
    const message = e instanceof Error ? e.message : 'Unexpected error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
