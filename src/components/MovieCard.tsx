import type { Movie } from "../types/movie";
import { Link, useNavigate } from "react-router-dom";


type Props = {
  movie: Movie;
  isFavorite: boolean;
  onToggleFavorite?: (movie: Movie) => void; // şimdilik opsiyonel
};

export default function MovieCard({ movie, isFavorite, onToggleFavorite }: Props) {
  const navigate = useNavigate();
  const posterSrc = movie.posterUrl
    ? `https://image.tmdb.org/t/p/w500${movie.posterUrl}`
    : "https://placehold.co/600x900/1a1a1a/ffffff.png?text=No+Poster";

  return (
    <div className="group overflow-hidden rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 transition">
      <Link to={`/movie/${movie.id}`} className="block">
        <div className="aspect-2/3 w-full overflow-hidden bg-black/30">
          <img
            src={posterSrc}
            alt={movie.title}
            className="h-full w-full object-cover group-hover:scale-[1.02] transition"
            loading="lazy"
          />
        </div>
      </Link>

      <div className="p-4">
        <Link to={`/movie/${movie.id}`} className="block">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="text-base font-semibold text-white leading-snug">
                {movie.title}
              </h3>
              <p className="mt-1 text-sm text-white/60">
                {movie.year ?? "—"}
              </p>
            </div>

            {typeof movie.rating === "number" && (
              <span className="shrink-0 rounded-lg bg-white/10 px-2 py-1 text-xs text-white/80">
                ⭐ {movie.rating.toFixed(1)}
              </span>
            )}
          </div>
        </Link>

        <div className="flex  flex-col md:flex-row md:gap-3" >

          <button onClick={() => navigate(`/movie/${movie.id}`)} className="mt-4 bg-white/10 w-full rounded-xl py-2 text-sm text-white/80 hover:bg-white/15">
            Details
          </button>
          <button
            onClick={() => onToggleFavorite?.(movie)}
            className={`${isFavorite ? "bg-yellow-500/20" : "bg-white/10"} mt-4 w-full rounded-xl py-2 text-sm text-white/80 hover:bg-white/15`}>
            {isFavorite ?
              <div className="text-yellow-500">
                Discard from Favorites
              </div>
              : "Add to Favorites"}
          </button>
        </div>
      </div>
    </div>
  );
}
