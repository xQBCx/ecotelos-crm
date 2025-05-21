'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

export default function ProjectsPage() {
  const [projects, setProjects] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({
    client_name: '',
    product: '',
    site_location: '',
    data_feed_url: '',
    status: 'active'
  })

  useEffect(() => {
    const fetchProjects = async () => {
      const { data } = await supabase.from('projects').select('*').order('created_at', { ascending: false })
      setProjects(data || [])
      setLoading(false)
    }
    fetchProjects()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const { data, error } = await supabase.from('projects').insert([form])
    if (error) return alert('Error adding project')
    setProjects([data[0], ...projects])
    setForm({ client_name: '', product: '', site_location: '', data_feed_url: '', status: 'active' })
  }

  return (
    <main className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Active Projects</h1>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <input value={form.client_name} onChange={e => setForm({ ...form, client_name: e.target.value })} placeholder="Client Name" required className="border p-2 rounded" />
        <input value={form.product} onChange={e => setForm({ ...form, product: e.target.value })} placeholder="Product" className="border p-2 rounded" />
        <input value={form.site_location} onChange={e => setForm({ ...form, site_location: e.target.value })} placeholder="Site Location" className="border p-2 rounded" />
        <input value={form.data_feed_url} onChange={e => setForm({ ...form, data_feed_url: e.target.value })} placeholder="Data Feed URL" className="border p-2 rounded md:col-span-2" />
        <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} className="border p-2 rounded md:col-span-2">
          <option value="active">Active</option>
          <option value="testing">Testing</option>
          <option value="archived">Archived</option>
        </select>
        <button type="submit" className="bg-blue-600 text-white p-2 rounded md:col-span-2">Add Project</button>
      </form>

      <h2 className="text-xl font-semibold mb-2">Project List</h2>
      {loading ? <p>Loading...</p> : (
        <ul className="space-y-4">
          {projects.map(project => (
            <li key={project.id} className="border rounded p-4">
              <p><strong>{project.client_name}</strong> — {project.product}</p>
              <p className="text-sm text-gray-600">Location: {project.site_location}</p>
              <p className="text-sm">Feed: {project.data_feed_url || 'N/A'}</p>
              <p className="text-xs text-gray-400">Status: {project.status} | Added: {new Date(project.created_at).toLocaleString()}</p>
            </li>
          ))}
        </ul>
      )}
    </main>
  )
}
