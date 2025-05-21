'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

export default function BrandSettings() {
  const [logo, setLogo] = useState<File | null>(null)
  const [brandName, setBrandName] = useState('')
  const [color, setColor] = useState('#00394f')
  const [userId, setUserId] = useState('')
  const [previewLogoUrl, setPreviewLogoUrl] = useState('')

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) setUserId(data.user.id)
    })
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    let logo_url = previewLogoUrl
    if (logo) {
      const fileName = `${Date.now()}_${logo.name}`
      const { data, error } = await supabase.storage.from('uploads').upload(fileName, logo)
      if (error) return alert('Logo upload failed')
      logo_url = data?.path ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/uploads/${data.path}` : ''
      setPreviewLogoUrl(logo_url)
    }
    const { error } = await supabase.from('brands').upsert({
      id: userId,
      name: brandName,
      logo_url,
      color_scheme: { primary: color }
    })
    if (error) alert('Error saving brand')
    else alert('Brand settings saved!')
  }

  return (
    <main className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Brand Settings</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          value={brandName}
          onChange={(e) => setBrandName(e.target.value)}
          placeholder="Brand Name"
          className="border p-2 rounded"
          required
        />
        <input
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          className="h-12 w-20 border p-1"
        />
        <input
          type="file"
          onChange={(e) => {
            const file = e.target.files?.[0] || null
            setLogo(file)
            if (file) setPreviewLogoUrl(URL.createObjectURL(file))
          }}
          className="border p-2 rounded"
        />
        <button type="submit" className="bg-blue-600 text-white p-2 rounded">Save Settings</button>
      </form>

      <div className="mt-8 border-t pt-6">
        <h2 className="text-xl font-semibold mb-2">Live Preview</h2>
        <div className="p-4 rounded shadow-md" style={{ backgroundColor: color }}>
          {previewLogoUrl && (
            <img src={previewLogoUrl} alt="Brand Logo" className="h-12 mb-2" />
          )}
          <h3 className="text-white text-lg font-bold">{brandName || 'Your Brand Name'}</h3>
        </div>
      </div>
    </main>
  )
}
