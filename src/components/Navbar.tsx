import type { User } from "firebase/auth";
import { Link, NavLink } from "react-router-dom";

type Props = {
  user: User | null;
  onLogout: () => void;
};

export default function Navbar({ user, onLogout }: Props) {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-black/40 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-2">
        <Link to="/" className="font-semibold tracking-tight text-white">
          <div className="flex items-center">

            <img className="w-15 " src="./logo.png" alt="Logo" />
            <span className="text-lg font-semibold invisible md:visible">MovieShelf</span>
          </div>
        </Link>

        <nav className="flex items-center gap-2">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `rounded-lg px-3 py-2 text-sm ${isActive ? "bg-white text-black" : "text-white/70 hover:text-white"
              }`
            }
          >
            Discover
          </NavLink>

          {user &&

            <NavLink
              to="/favorites"
              className={({ isActive }) =>
                `rounded-lg px-3 py-2 text-xs md:text-sm ${isActive ? "bg-white text-black" : "text-white/70 hover:text-white"
                }`
              }
            >
              Favorites
            </NavLink>
          }
          <div className="flex items-center gap-3">
            {user ? (
              <>
                <span className="hidden sm:inline text-sm text-white/70">
                  {user.email}
                </span>
                <button
                  onClick={onLogout}
                  className="rounded-xl bg-white/10 px-4 py-2 text-sm text-white hover:bg-white/15"
                >
                  Sign out
                </button>
              </>
            ) : (
              <NavLink
                to="/auth"
                className={({ isActive }) =>
                  `rounded-lg px-3 py-2 text-sm ${isActive ? "bg-white text-black" : "text-white/70 hover:text-white"
                  }`
                }              >
                Sign in
              </NavLink>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}
