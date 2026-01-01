import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import DiscoverPage from "./pages/DiscoverPage";
import FavoritesPage from "./pages/FavoritesPage";
import MovieDetailPage from "./pages/MovieDetailPage";
//new auth imprts
import type { User } from "firebase/auth";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase/firebase";
import AuthPage from "./pages/AuthPage";
import { getFavorites, addFavorite, removeFavorite } from "./services/favoritesService";

//logout
import { logout } from "./services/authService";
import { useNavigate } from "react-router-dom";


import { useEffect, useState } from "react";
import type { Movie } from "./types/movie";

export default function App() {


  const [favorites, setFavorites] = useState<Movie[]>([]);

  //auth states
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  //navigte için butonla
  const navigate = useNavigate();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      setAuthLoading(false);

      if (u) {
        const favs = await getFavorites(u.uid);
        setFavorites(favs);
      } else {
        setFavorites([]); // logout olunca temizle
      }
    });

    return () => unsub();
  }, []);


async function toggleFavorite(movie: Movie) {
  if (!user) {
    navigate("/auth");
    return;
  }

  const exists = favorites.some((f) => f.id === movie.id);

  // ✅ doğru optimistic güncelleme
  setFavorites((prev) =>
    exists ? prev.filter((x) => x.id !== movie.id) : [...prev, movie]
  );

  try {
    if (exists) await removeFavorite(user.uid, movie.id);
    else await addFavorite(user.uid, movie);
  } catch (e) {
    // ✅ rollback (tersini uygula)
    setFavorites((prev) =>
      exists ? [...prev, movie] : prev.filter((x) => x.id !== movie.id)
    );
  }
}




  return (
    <div className="min-h-screen bg-[#05070d] text-white">
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute -top-40 left-1/2 h-150 w-150 -translate-x-1/2 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute bottom-50 right-50 h-125 w-125 rounded-full bg-white/5 blur-3xl" />
      </div>

      <div className="relative">
        <Navbar
          user={user}
          onLogout={async () => {
            await logout();
            navigate("/"); 
          }}
        />
        <Routes>
          <Route
            path="/"
            element={
              <DiscoverPage
                favorites={favorites}
                onToggleFavorite={toggleFavorite}
              />
            }
          />
          <Route
            path="/favorites"
            element={
              <FavoritesPage
                favorites={favorites}
                onToggleFavorite={toggleFavorite}
              />
            }
          />
          <Route
            path="/movie/:id"
            element={
              <MovieDetailPage
                favorites={favorites}
                onToggleFavorite={toggleFavorite}
              />
            }
          />
          <Route
            path="/auth"
            element={<AuthPage />} />

        </Routes>
      </div>
    </div>
  );
}
