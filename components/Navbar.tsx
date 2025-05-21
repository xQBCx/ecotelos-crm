'use client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'

export default function Navbar() {
  const router = useRouter()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <nav className="bg-gray-800 text-white p-4 flex flex-wrap items-center justify-between">
      <div className="flex gap-4 items-center">
        <Link href="/dashboard" className="hover:underline">Dashboard</Link>
        <Link href="/crm/leads" className="hover:underline">Leads</Link>
        <Link href="/projects" className="hover:underline">Projects</Link>
        <Link href="/analytics" className="hover:underline">Analytics</Link>
        <Link href="/settings/brand" className="hover:underline">Brand Settings</Link>
      </div>
      <button onClick={handleLogout} className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded">
        Logout
      </button>
    </nav>
  )
}
