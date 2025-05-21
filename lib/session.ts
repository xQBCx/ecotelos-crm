'use server'
import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'

export const getSession = async () => {
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies }
  )
  const { data: { session } } = await supabase.auth.getSession()
  return session
}
