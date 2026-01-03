import { useState } from "react";
import MovieCard from "../components/MovieCard";
import type { Movie } from "../types/movie";
import { getAxiosErrorInfo } from "../services/movieService";
import FeaturedSlider from "./FeaturedSlider";
import { usePopularMovies } from "../queries/usePopularMovies";
import { useSearchMovies } from "../queries/useSearchMovies";
import { useGenres } from "../queries/useGenres";
import { useDiscoverMovies } from "../queries/useDiscoverMovies";


type Props = {
    favorites: Movie[];
    onToggleFavorite: (movie: Movie) => void;
};


export default function DiscoverPage({ favorites, onToggleFavorite }: Props) {
    const [searchTerm, setSearchTerm] = useState("");
    const [open, setOpen] = useState(false)
    const isSearching = !!searchTerm.trim();
    const [page, setPage] = useState(1); // şimdilik sabit, sonra pagination ekleriz

    const popularQuery = usePopularMovies(page, !isSearching);
    const searchQuery = useSearchMovies(searchTerm);

    //tür filtreleme
    const [selectedGenreIds, setSelectedGenreIds] = useState<number[]>([]);
    function toggleGenre(id: number) {
        if (isSearching) return;
        setSelectedGenreIds((prev) =>
            prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
        );
        setPage(1); // filtre değişince sayfayı başa al
    }
    const genresQuery = useGenres();
    const discoverQuery = useDiscoverMovies(page, selectedGenreIds);



    const moviesToShow = isSearching
        ? (searchQuery.data ?? [])
        : (discoverQuery.data ?? []);

    const loadingToShow = isSearching
        ? searchQuery.isLoading
        : discoverQuery.isLoading;

    const searchingNow = isSearching && searchQuery.isFetching && !searchQuery.isLoading;

    const sliderData = popularQuery.data ?? [];
    const errorToShow = isSearching
        ? (searchQuery.isError ? getAxiosErrorInfo(searchQuery.error).message : null)
        : (discoverQuery.isError ? getAxiosErrorInfo(discoverQuery.error).message : null);




    return (
        <>
            <FeaturedSlider
                movies={sliderData.slice(page, page + 9)}
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
                            onClick={() => { setSearchTerm("");setSelectedGenreIds([]); setPage(1); }}
                        >
                            Clear
                        </button>
                    </div>

                    <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4">
                        <button
                            onClick={() => setOpen((o) => !o)}
                            className=" flex w-full items-center justify-between text-sm font-medium text-white/80"
                        >
                            <span>Filter by genre</span>

                            <span className={`text-white/60 transition-transform duration-300 ${open ? "rotate-180" : "rotate-0"}`}>
                                ▼
                            </span>
                        </button>

                        <div
                            className={[
                                "overflow-hidden transition-all duration-600 ease-in-out",
                                open ? "max-h-125 opacity-100 translate-y-0" : "max-h-0 opacity-0 -translate-y-1",
                            ].join(" ")}
                        >
                            <div className="pt-2">
                                {genresQuery.isLoading ? (
                                    <div className="text-sm text-white/60">Loading genres...</div>
                                ) : genresQuery.isError ? (
                                    <div className="text-sm text-red-200">{genresQuery.error.message}</div>
                                ) : (
                                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
                                        {genresQuery.data!.map((g) => {
                                            const checked = selectedGenreIds.includes(g.id);
                                            return (
                                                <label
                                                    key={g.id}
                                                    className="flex cursor-pointer items-center gap-2 rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-sm text-white/80 hover:border-white/20"
                                                >
                                                    <input
                                                        type="checkbox"
                                                        checked={checked}
                                                        disabled={isSearching}
                                                        onChange={() => toggleGenre(g.id)}
                                                    />
                                                    {g.name}
                                                </label>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        </div>

                    </div>

                    {errorToShow ? <div className="text-center mt-15 text-3xl">Hata: {errorToShow}</div> : null}
                    {loadingToShow ? <div className="text-center mt-15 text-3xl">Loading...</div> : null}
                    {searchingNow ? <div className="text-center mt-15 text-3xl">Searching...</div> : null}

                    <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {moviesToShow.map((m) => (
                            <MovieCard
                                key={m.id}
                                movie={m}
                                isFavorite={favorites.some(f => f.id === m.id)}
                                onToggleFavorite={onToggleFavorite}
                            />
                        ))}
                    </div>
                </div>
                <div className="flex w-full justify-between px-15">
                    {(page > 1) &&

                        <button className="mt-4 w-35 rounded-xl py-2 text-sm text-white/80 hover:bg-white/15 bg-white/10"
                            disabled={isSearching || page === 1}
                            onClick={() => setPage((p) => Math.max(1, p - 1))}
                        >
                            Previus Page
                        </button>
                    }
                    <div className="flex justify-center mt-4    w-full">

                        <span className=" text-center text-xl px-4 rounded-xl py-2 bg-white/10">{page}</span>
                    </div>
                    <button
                        className="mt-4 w-35 rounded-xl py-2 text-sm text-white/80 hover:bg-white/15 bg-white/10"
                        onClick={() => (setPage(prev => prev + 1))}
                        disabled={isSearching}
                    >

                        Next Page
                    </button>
                </div>
            </div>
        </>
    );
}
