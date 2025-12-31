import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import type { Movie } from "../types/movie";
import { getMovieDetail, getMovieCredits } from "../services/movieService";
import type { TmdbMovie, TmdbCastMember } from "../types/tmdb";
import { getAxiosErrorInfo } from "../services/movieService"; // sende hangi helper varsa

type Props = {
  favorites: Movie[];
  onToggleFavorite: (movie: Movie) => void;
};

export default function MovieDetailPage({ favorites, onToggleFavorite }: Props) {
  const { id } = useParams();
  const movieId = Number(id);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [detail, setDetail] = useState<TmdbMovie | null>(null);
  const [cast, setCast] = useState<TmdbCastMember[]>([]);

  useEffect(() => {
    if (!movieId || Number.isNaN(movieId)) {
      setError("Invalid movie id");
      return;
    }

    const controller = new AbortController();

    (async () => {
      try {
        setLoading(true);
        setError(null);

        const [d, c] = await Promise.all([
          getMovieDetail(movieId, controller.signal),
          getMovieCredits(movieId, controller.signal),
        ]);

        setDetail(d);
        setCast(c.slice(0, 10));
      } catch (err: any) {
        const msg = getAxiosErrorInfo(err).message;
        if (controller.signal.aborted) return;
        setError(msg);
      } finally {
        setLoading(false);
      }
    })();

    return () => controller.abort();
  }, [movieId]);

  if (loading) return <div className="mx-auto max-w-6xl px-4 py-10 text-white/80">Loading…</div>;
  if (error) return <div className="mx-auto max-w-6xl px-4 py-10 text-red-300">Error: {error}</div>;
  if (!detail) return null;

  const year = detail.release_date?.slice(0, 4);
  const backdrop = detail.backdrop_path
    ? `https://image.tmdb.org/t/p/w1280${detail.backdrop_path}`
    : undefined;


  const asMovie: Movie = {
    id: detail.id,
    title: detail.title,
    year,
    posterUrl: detail.poster_path ?? undefined,
    backdropUrl: detail.backdrop_path ?? undefined,
    rating: detail.vote_average,
  };

  const isFavorite = favorites.some((f) => f.id === detail.id);

  return (
    <div className="min-h-screen">
      <div className="relative h-[80vh] w-full overflow-hidden">
        {backdrop && (
          <img
            src={backdrop}
            alt={detail.title}
            className="absolute inset-0 h-full w-full object-cover object-center"
          />
        )}
        <div className="absolute inset-0 bg-linear-to-r from-black/85 via-black/50 to-black/10" />

        <div className="relative mx-auto flex h-full max-w-6xl items-end px-4 pb-10">
          <div className="max-w-2xl">
            <Link to="/" className="
  text-white/70
  hover:text-white
  rounded-xl
  px-4 py-3

  bg-white/10
  md:bg-transparent
  md:hover:bg-white/10

  transition-colors
  duration-400
">← Back</Link>

            <h1 className="mt-3 text-4xl font-bold text-white">{detail.title}</h1>
            <p className="mt-2 text-white/70">
              {year ?? "—"} • ⭐ {detail.vote_average?.toFixed(1) ?? "—"}
              {detail.runtime ? ` • ${detail.runtime} min` : ""}
            </p>

            <div className="mt-5 flex flex-wrap gap-2">
              {detail.genres?.map((g) => (
                <span key={g.id} className="rounded-full bg-white/10 px-3 py-1 text-sm text-white/80">
                  {g.name}
                </span>
              ))}
            </div>

            <p className="mt-5 text-white/80 leading-relaxed">
              {detail.overview || "No description available."}
            </p>

            <div className="mt-6 flex gap-3">
              <button
                onClick={() => onToggleFavorite(asMovie)}
                className={`${isFavorite ? "bg-yellow-500/50" : "bg-white/10"} rounded-xl  px-5 py-3 text-white hover:bg-white/25`}
              >
                {isFavorite ? "Remove Favorite" : "Add to Favorites"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Oyuncular */}
      <div className="mx-auto max-w-6xl px-4 py-10">
        <h2 className="text-xl font-semibold text-white">Actors</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {cast.map((p) => {
            const profile = p.profile_path
              ? `https://image.tmdb.org/t/p/w185${p.profile_path}`
              : null;

            return (
              <div key={p.id} className="flex gap-3 rounded-2xl border border-white/10 bg-white/5 p-3">
                <div className="h-16 w-16 overflow-hidden rounded-xl bg-white/10">
                  {profile && <img src={profile} alt={p.name} className="h-full w-full object-cover" />}
                </div>
                <div>
                  <p className="font-medium text-white">{p.name}</p>
                  <p className="text-sm text-white/60">{p.character ?? ""}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
