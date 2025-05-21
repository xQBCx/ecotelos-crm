'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

export default function LeadsPage() {
  const [leads, setLeads] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    notes: '',
    source: ''
  })

  useEffect(() => {
    const fetchLeads = async () => {
      const { data } = await supabase.from('leads').select('*').order('created_at', { ascending: false })
      setLeads(data || [])
      setLoading(false)
    }
    fetchLeads()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const { data, error } = await supabase.from('leads').insert([form])
    if (error) return alert('Error adding lead')
    setLeads([data[0], ...leads])
    setForm({ name: '', email: '', phone: '', company: '', notes: '', source: '' })
  }

  return (
    <main className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">CRM - Leads</h1>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Name" required className="border p-2 rounded" />
        <input value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="Email" className="border p-2 rounded" />
        <input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="Phone" className="border p-2 rounded" />
        <input value={form.company} onChange={e => setForm({ ...form, company: e.target.value })} placeholder="Company" className="border p-2 rounded" />
        <input value={form.source} onChange={e => setForm({ ...form, source: e.target.value })} placeholder="Source (referral, event...)" className="border p-2 rounded md:col-span-2" />
        <textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} placeholder="Notes" className="border p-2 rounded md:col-span-2" />
        <button type="submit" className="bg-blue-600 text-white p-2 rounded md:col-span-2">Add Lead</button>
      </form>

      <h2 className="text-xl font-semibold mb-2">Recent Leads</h2>
      {loading ? <p>Loading...</p> : (
        <ul className="space-y-4">
          {leads.map(lead => (
            <li key={lead.id} className="border rounded p-4">
              <p><strong>{lead.name}</strong> — {lead.company}</p>
              <p className="text-sm text-gray-600">{lead.email} | {lead.phone}</p>
              <p className="text-sm">{lead.notes}</p>
              <p className="text-xs text-gray-400">Source: {lead.source || 'Unspecified'} | Added: {new Date(lead.created_at).toLocaleString()}</p>
            </li>
          ))}
        </ul>
      )}
    </main>
  )
}
