import MovieCard from "../components/MovieCard";
import type { Movie } from "../types/movie";

type Props = {
  favorites: Movie[];
  onToggleFavorite: (movie: Movie) => void;
};

export default function FavoritesPage({ favorites, onToggleFavorite }: Props) {
  console.log(favorites)
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-3xl font-semibold text-white">Favorites</h1>
      <p className="mt-2 text-white/70">
        Here we’ll show favorites from Firebase later.
      </p>
      {(favorites.length === 0) ?

        <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-6 text-white/70">
          No favorites yet.
        </div> :
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

          {favorites.map((m) => (
            <MovieCard
              key={m.id}
              movie={m}
              isFavorite={true}
              onToggleFavorite={onToggleFavorite}
            />
          ))}
        </div>
      }


    </div>
  );
}
