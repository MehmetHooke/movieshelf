import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import DiscoverPage from "./pages/DiscoverPage";
import FavoritesPage from "./pages/FavoritesPage";
import MovieDetailPage from "./pages/MovieDetailPage";

import { useState } from "react";
import type { Movie } from "./types/movie";

export default function App() {
  const [favorites, setFavorites] = useState<Movie[]>([]);

  function toggleFavorite(movie: Movie) {
    const exists = favorites.some((f) => f.id === movie.id);

    if (exists) {
      setFavorites((prev) => prev.filter((item) => item.id !== movie.id));
    } else {
      setFavorites((prev) => [...prev, movie]);
    }
  }


  return (
    <div className="min-h-screen bg-[#05070d] text-white">
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute -top-40 left-1/2 h-150 w-150 -translate-x-1/2 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute bottom-50 right-50 h-125 w-125 rounded-full bg-white/5 blur-3xl" />
      </div>

      <div className="relative">
        <Navbar />
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

        </Routes>
      </div>
    </div>
  );
}
