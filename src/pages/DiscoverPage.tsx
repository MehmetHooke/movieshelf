import { useEffect, useState } from "react";
import MovieCard from "../components/MovieCard";
import type { Movie } from "../types/movie";
import { getAxiosErrorInfo, getPopularMovies, searchMovies } from "../services/movieService";
import FeaturedSlider from "./FeaturedSlider";

type Props = {
    favorites: Movie[];
    onToggleFavorite: (movie: Movie) => void;
};


export default function DiscoverPage({ favorites, onToggleFavorite }: Props) {
    const [searchTerm, setSearchTerm] = useState("");
    const [movie, setMovie] = useState<Movie[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        if (!searchTerm.trim()) {
            // ✅ arama boşsa popular’a dön
            (async () => {
                try {
                    setLoading(true);
                    setError(null);
                    const data = await getPopularMovies();
                    setMovie(data);
                } catch (err: unknown) {
                    setError(getAxiosErrorInfo(err).message);
                } finally {
                    setLoading(false);
                }
            })();

            return;
        }

        const controller = new AbortController();

        const t = setTimeout(async () => {
            try {
                setLoading(true);
                setError(null);
                const data = await searchMovies(searchTerm, controller.signal);
                setMovie(data);
            } catch (err: unknown) {
                // ✅ abort kaynaklı hata mesajı basma (bonus)
                const msg = getAxiosErrorInfo(err).message.toLowerCase();
                if (msg.includes("canceled") || msg.includes("abort")) return;
                setError(getAxiosErrorInfo(err).message);
            } finally {
                setLoading(false);
            }
        }, 400);

        return () => {
            clearTimeout(t);
            controller.abort();
        };
    }, [searchTerm]);



    return (
        <>
            <FeaturedSlider
                movies={movie.slice(0, 5)}
                favorites={favorites}
                onToggleFavorite={onToggleFavorite}
            />


            <div className="relative z-10 mx-auto  -mt-36 max-w-6xl px-4 pb-20">
                <div className="rounded-3xl  bg-[#05070d] p-8">
                    <p className="text-sm text-white/60">Movie discovery • Favorites • Clean UI</p>
                    <h1 className="mt-2 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                        Discover
                    </h1>

                    <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                        <input
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search movies…"
                            className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white placeholder:text-white/40 outline-none focus:border-white/20"
                        />
                        <button
                            className="rounded-xl bg-white px-5 py-3 font-medium text-black hover:bg-white/90"
                            onClick={() => setSearchTerm("")}
                        >
                            Clear
                        </button>
                    </div>

                    {error ? <div className=" text-center mt-15 text-3xl">Hata : {error}</div> : null}

                    {loading ? <div className=" text-center mt-15 text-3xl">Loading...</div> : null}

                    <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {movie.map((m) => (
                            <MovieCard
                                key={m.id}
                                movie={m}
                                isFavorite={favorites.some(f => f.id === m.id)}
                                onToggleFavorite={onToggleFavorite}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}
