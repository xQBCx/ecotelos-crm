'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

export default function AnalyticsDashboard() {
  const [leadCount, setLeadCount] = useState(0)
  const [activityCount, setActivityCount] = useState(0)
  const [projectCount, setProjectCount] = useState(0)
  const [topSources, setTopSources] = useState<Record<string, number>>({})

  useEffect(() => {
    const fetchData = async () => {
      const [{ count: leads }, { count: activities }, { count: projects }] = await Promise.all([
        supabase.from('leads').select('*', { count: 'exact', head: true }),
        supabase.from('activity_logs').select('*', { count: 'exact', head: true }),
        supabase.from('projects').select('*', { count: 'exact', head: true })
      ])
      setLeadCount(leads || 0)
      setActivityCount(activities || 0)
      setProjectCount(projects || 0)

      const { data } = await supabase.from('leads').select('source')
      const sourceTally: Record<string, number> = {}
      data?.forEach((lead) => {
        const source = lead.source || 'Unspecified'
        sourceTally[source] = (sourceTally[source] || 0) + 1
      })
      setTopSources(sourceTally)
    }
    fetchData()
  }, [])

  return (
    <main className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Analytics Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white shadow p-4 rounded">
          <h2 className="text-lg font-semibold">Total Leads</h2>
          <p className="text-3xl font-bold text-blue-600">{leadCount}</p>
        </div>
        <div className="bg-white shadow p-4 rounded">
          <h2 className="text-lg font-semibold">Activity Logs</h2>
          <p className="text-3xl font-bold text-green-600">{activityCount}</p>
        </div>
        <div className="bg-white shadow p-4 rounded">
          <h2 className="text-lg font-semibold">Projects</h2>
          <p className="text-3xl font-bold text-purple-600">{projectCount}</p>
        </div>
      </div>

      <div className="bg-white shadow p-4 rounded">
        <h2 className="text-lg font-semibold mb-4">Top Lead Sources</h2>
        <ul className="list-disc pl-5 space-y-1">
          {Object.entries(topSources).map(([source, count]) => (
            <li key={source} className="text-sm">
              {source}: <strong>{count}</strong>
            </li>
          ))}
        </ul>
      </div>
    </main>
  )
}
