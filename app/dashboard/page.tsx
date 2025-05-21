'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'

export default function DashboardPage() {
  const router = useRouter()
  const [session, setSession] = useState<any>(null)
  const [type, setType] = useState('call')
  const [description, setDescription] = useState('')
  const [file, setFile] = useState<File | null>(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) router.push('/login')
      else setSession(session)
    })
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    let file_url = null
    if (file) {
      const fileName = `${Date.now()}_${file.name}`
      const { data, error } = await supabase.storage.from('uploads').upload(fileName, file)
      if (error) return alert('File upload failed')
      file_url = data?.path
    }

    await supabase.from('activity_logs').insert({
      type,
      description,
      file_url,
      user_id: session.user.id,
      timestamp: new Date().toISOString()
    })

    setDescription('')
    setFile(null)
    alert('Activity logged!')
  }

  return (
    <main className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">EcoTelos CRM Dashboard</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <select value={type} onChange={(e) => setType(e.target.value)} className="border p-2 rounded">
          <option value="call">Phone Call</option>
          <option value="note">Field Note</option>
          <option value="photo">Photo</option>
          <option value="card">Business Card</option>
          <option value="lead">Lead</option>
        </select>
        <textarea
          placeholder="Description or note..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="border p-2 rounded"
          required
        />
        <input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} className="border p-2 rounded" />
        <button type="submit" className="bg-blue-600 text-white p-2 rounded">Submit Entry</button>
      </form>
    </main>
  )
}
