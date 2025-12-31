import { Link, NavLink } from "react-router-dom";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-black/40 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-2">
        <Link to="/" className="font-semibold tracking-tight text-white">
        <div className="flex items-center">

        <img className="w-15   " src="/src/assets/icon.png" alt="Logo" />
        <span className="text-lg font-semibold invisible md:visible">MovieShelf</span>
        </div>
        </Link>

        <nav className="flex items-center gap-2">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `rounded-lg px-3 py-2 text-sm ${
                isActive ? "bg-white text-black"  : "text-white/70 hover:text-white"
              }`
            }
          >
            Discover
          </NavLink>

          <NavLink
            to="/favorites"
            className={({ isActive }) =>
              `rounded-lg px-3 py-2 text-xs md:text-sm ${
                isActive ? "bg-white text-black" : "text-white/70 hover:text-white"
              }`
            }
          >
            Favorites
          </NavLink>
        </nav>
      </div>
    </header>
  );
}
