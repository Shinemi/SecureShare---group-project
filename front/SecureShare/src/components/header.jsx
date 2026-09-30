import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'

const linkClass = ({ isActive }) =>
  `px-3 py-2 rounded-lg transition ${
    isActive ? 'text-indigo-600 font-semibold' : 'text-gray-600 hover:text-indigo-600'
  }`

export default function Header() {
  const navigate = useNavigate()
  useLocation() // force un nouveau rendu à chaque changement de page, donc le bouton s'actualise
  const isLoggedIn = !!localStorage.getItem('token')

  const handleLogout = () => {
    localStorage.removeItem('token')
    navigate('/login')
  }

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-5xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-3">
        <Link to="/" className="text-xl font-bold text-indigo-600">
          SecureShare
        </Link>

        <nav className="flex flex-wrap items-center gap-1">
          <NavLink to="/" className={linkClass}>Accueil</NavLink>
          <NavLink to="/feed" className={linkClass}>Feed</NavLink>
          <NavLink to="/publish" className={linkClass}>Créer un post</NavLink>

          {isLoggedIn ? (
            <button
              onClick={handleLogout}
              className="ml-2 px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition"
            >
              Déconnexion
            </button>
          ) : (
            <>
              <NavLink to="/login" className={linkClass}>Connexion</NavLink>
              <NavLink
                to="/register"
                className="ml-2 px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition"
              >
                Inscription
              </NavLink>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}