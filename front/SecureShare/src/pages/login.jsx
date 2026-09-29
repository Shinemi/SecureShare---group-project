import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const API_URL = 'http://localhost:3000/api/v1/auth/login'

export default function Login() {
    const navigate = useNavigate()
    const [form, setForm] = useState({ email: '', password: '' })
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false)

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        try {
            const res = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form),
            })
            const data = await res.json()
            if (!res.ok) throw new Error(data.message || 'Erreur serveur')

            localStorage.setItem('token', data.token)
            navigate('/publish')
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-[70vh] flex items-center justify-center p-4">
            <form
                onSubmit={handleSubmit}
                className="w-full max-w-sm bg-white p-6 rounded-xl shadow-md space-y-4"
            >
                <h1 className="text-2xl font-bold text-center">Connexion</h1>

                {/* <input
                    type="text"
                    name="name"
                    placeholder="Nom"
                    value={form.name}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                /> */}

                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />

                <div>
                    <input
                        type="password"
                        name="password"
                        placeholder="Mot de passe"
                        value={form.password}
                        onChange={handleChange}
                        required
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                        6 caractères min, avec majuscule, minuscule, chiffre et symbole.
                    </p>
                </div>

                {error && <p className="text-red-600 text-sm">{error}</p>}

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition"
                >
                    {loading ? 'Connexion...' : "Se connecter"}
                </button>

                <p className="text-sm text-center text-gray-600">
                    Pas encore inscrit ?{' '}
                    <Link to="/register" className="text-indigo-600 hover:underline">
                        S'inscrire
                    </Link>
                </p>
            </form>
        </div>
    )

}