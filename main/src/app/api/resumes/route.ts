import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

// ---------- Types ----------
type ResumePayload = {
  title: string
  template: string
  sections: Record<string, unknown>
  data: Record<string, unknown>
  parent_id?: string | null
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
type ResumeRow = {
  id: string
  title: string
  template: string
  sections: Record<string, unknown>
  data: Record<string, unknown>
  parent_id?: string | null
  version?: number
  created_at?: string
  updated_at?: string
}

// ---------- CREATE (new or copy) ----------
export async function POST(req: NextRequest) {
  try {
    const supabase = createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user)
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = (await req.json()) as ResumePayload
    const { title, template, sections, data, parent_id } = body

    let version = 1
    const parentId: string | null = parent_id ?? null

    // Calculate next version if saving a copy
    if (parentId) {
      const { data: siblings, error: versionErr } = await supabase
        .from('resumes')
        .select('version')
        .eq('parent_id', parentId)

      if (versionErr)
        return NextResponse.json({ error: versionErr.message }, { status: 400 })

      const versions = siblings?.map((s) => s.version as number) ?? []
      version = Math.max(0, ...versions) + 1
    }

    const { data: inserted, error } = await supabase
      .from('resumes')
      .insert({
        user_id: user.id,
        title,
        template,
        sections,
        data,
        parent_id: parentId,
        version,
      })
      .select('id, version')
      .single()

    if (error)
      return NextResponse.json({ error: error.message }, { status: 400 })

    return NextResponse.json(
      { id: inserted.id, version: inserted.version },
      { status: 200 }
    )
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'Unexpected error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

// ---------- READ (single or list) ----------
export async function GET(req: NextRequest) {
  try {
    const supabase = createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user)
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')

    if (id) {
      const { data, error } = await supabase
        .from('resumes')
        .select('id, title, template, sections, data, parent_id, version, created_at, updated_at')
        .eq('id', id)
        .eq('user_id', user.id)
        .single()

      if (error)
        return NextResponse.json({ error: error.message }, { status: 400 })

      return NextResponse.json({ data }, { status: 200 })
    } else {
      const { data, error } = await supabase
        .from('resumes')
        .select('id, title, template, version, created_at, updated_at')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false })

      if (error)
        return NextResponse.json({ error: error.message }, { status: 400 })

      return NextResponse.json({ data }, { status: 200 })
    }
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'Unexpected error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

// ---------- UPDATE ----------
export async function PUT(req: NextRequest) {
  try {
    const supabase = createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user)
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')
    if (!id)
      return NextResponse.json({ error: 'Missing resume id' }, { status: 400 })

    const body = (await req.json()) as ResumePayload
    const { title, template, sections, data } = body

    const { error } = await supabase
      .from('resumes')
      .update({
        title,
        template,
        sections,
        data,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .eq('user_id', user.id)

    if (error)
      return NextResponse.json({ error: error.message }, { status: 400 })

    return NextResponse.json({ message: 'Updated successfully' }, { status: 200 })
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'Unexpected error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

// ---------- DELETE ----------
export async function DELETE(req: NextRequest) {
  try {
    const supabase = createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user)
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')
    if (!id)
      return NextResponse.json({ error: 'Missing resume id' }, { status: 400 })

    const { error } = await supabase
      .from('resumes')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id)

    if (error)
      return NextResponse.json({ error: error.message }, { status: 400 })

    return NextResponse.json({ message: 'Deleted successfully' }, { status: 200 })
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'Unexpected error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
