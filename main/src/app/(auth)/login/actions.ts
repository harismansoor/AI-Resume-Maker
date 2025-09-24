'use server'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export async function signup(formData: FormData) {
  const email = String(formData.get('email') || '')
  const password = String(formData.get('password') || '')
  const supabase = createClient()
  const { error } = await supabase.auth.signUp({ email, password })
  if (error) {
    console.error('Signup error:', error.message)
    return
  }
  redirect('/dashboard')
}

export async function login(formData: FormData) {
  const email = String(formData.get('email') || '')
  const password = String(formData.get('password') || '')
  const supabase = createClient()
  const { error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) {
    console.error('Login error:', error.message)
    return
  }
  redirect('/dashboard')
}
