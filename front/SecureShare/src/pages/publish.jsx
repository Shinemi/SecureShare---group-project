import { useState } from 'react'

const API_URL = 'http://localhost:3000/api/v1/posts' // à adapter à ta route d'upload

export default function Publish() {
  const token = localStorage.getItem('token')
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [title, setTitle] = useState('')
  const [caption, setCaption] = useState('')
  const [status, setStatus] = useState(null) // { type: 'ok' | 'error', message }
  const [loading, setLoading] = useState(false)

  const handleFile = (e) => {
    const f = e.target.files[0]
    if (!f) return
    setFile(f)
    setPreview(URL.createObjectURL(f))
    setStatus(null)
  }

  const handleUpload = async () => {
    if (!file || !title.trim()) return
    setLoading(true)
    setStatus(null)

    const formData = new FormData()
    formData.append('title', title.trim())
    formData.append('caption', caption)
    formData.append('image', file) // doit correspondre à upload.single('image')

    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      })
      const data = await res.json()
      if (res.status === 401) throw new Error('Non autorisé : token manquant ou invalide')
      if (!res.ok) throw new Error(data.message || 'Erreur serveur')
      setStatus({ type: 'ok', message: 'Upload réussi : ' + JSON.stringify(data) })
    } catch (err) {
      setStatus({ type: 'error', message: err.message })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-bold">Créer un post</h1>

      <input
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleFile}
        className="block w-full text-sm file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-indigo-600 file:text-white hover:file:bg-indigo-700"
      />

      {preview && <img src={preview} alt="Aperçu" className="w-full rounded-lg shadow" />}

      <input
        type="text"
        placeholder="Titre *"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        maxLength={100}
        required
        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />

      <input
        type="text"
        placeholder="Légende"
        value={caption}
        onChange={(e) => setCaption(e.target.value)}
        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />

      <button
        onClick={handleUpload}
        disabled={!file || !title.trim() || loading}
        className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition"
      >
        {loading ? 'Envoi...' : 'Publier'}
      </button>

      {status && (
        <p className={status.type === 'ok' ? 'text-green-600 break-all' : 'text-red-600'}>
          {status.message}
        </p>
      )}
    </div>
  )
}