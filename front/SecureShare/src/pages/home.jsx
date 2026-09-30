import { Link } from 'react-router-dom'


export default function Home() {
  const isLoggedIn = !!localStorage.getItem('token')

  return (
    <div className="max-w-5xl mx-auto px-4 py-12 space-y-16">
      <section className="text-center space-y-6">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
          Partage tes images en toute sécurité
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          SecureShare est un mini réseau social pour publier des visuels accompagnés de légendes.
        </p>

        <div className="flex flex-wrap justify-center gap-3">
          {isLoggedIn ? (
            <Link
              to="/publish"
              className="px-6 py-3 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition"
            >
              Créer un post
            </Link>
          ) : (
            <Link
              to="/register"
              className="px-6 py-3 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition"
            >
              Commencer
            </Link>
          )}
          <Link
            to="/feed"
            className="px-6 py-3 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition"
          >
            Voir le feed
          </Link>
        </div>
      </section>

     
    </div>
  )
}