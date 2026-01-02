import { useEffect, useState } from "react";
import type { Movie } from "../types/movie";
import { Link } from "react-router-dom";

type Props = {
    movies: Movie[];
    onToggleFavorite: (movie: Movie) => void;
    favorites: Movie[];
};

export default function FeaturedSlider({
    movies,
    onToggleFavorite,
    favorites,
}: Props) {
    const [index, setIndex] = useState(0);

    useEffect(() => {
        if (movies.length === 0) return;

        const t = setInterval(() => {
            setIndex((prev) => (prev + 1) % movies.length);
        }, 5000);

        return () => clearInterval(t);
    }, [movies]);

    if (movies.length === 0) return null;

    const movie = movies[index];
    const isFavorite = favorites.some((f) => f.id === movie.id);

    const backdrop = movie.backdropUrl
        ? `https://image.tmdb.org/t/p/w1280${movie.backdropUrl}`
        : undefined;

    return (
        
        <section className="relative h-[80vh] w-full -mt-14 overflow-hidden pb-34">
           <Link to={`/movie/${movie.id}`} className="block">
            {backdrop && (
                <img
                    src={backdrop}
                    alt={movie.title}
                    className="absolute inset-0 h-full w-full object-cover object-center"
                    loading="eager"
                />
            )}
           </Link>

            {/* Overlay */}
            <div className="absolute inset-0 bg-linear-to-r from-black/80 via-black/40 to-black/10" />

            <div className="relative z-10 mx-auto flex h-full max-w-6xl items-end px-6 pb-16">
                <div className="max-w-xl">
                    <Link to={`/movie/${movie.id}`} className="block">
                    <h2 className="text-4xl font-bold leading-tight text-white">
                        {movie.title}
                    </h2>

                    <p className="mt-3 text-white/70">
                        {movie.year}
                    </p>
                    </Link>

                    <div className="mt-6 flex gap-3">
                        <button className="rounded-lg bg-white px-6 py-3 font-medium text-black hover:bg-white/90">
                            Details
                        </button>

                        <button
                            onClick={() => onToggleFavorite(movie)}
                            className="rounded-lg bg-white/20 px-6 py-3 text-white hover:bg-white/30"
                        >
                            {isFavorite ? "Remove Favorite" : "Add to Favorites"}
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}
