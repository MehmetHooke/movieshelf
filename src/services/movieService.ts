import axios from "axios";
import { tmdb } from "../api/tmdb";
import type { Movie } from "../types/movie";
import type { Genre, TmdbCastMember, TmdbCreditsResponse, TmdbGenreListResponse, TmdbMovie, TmdbPagedResponse } from "../types/tmdb";

function mapTmdbMovie(m:TmdbMovie):Movie{
    return { 
        id: m.id,
        title: m.title,
        posterUrl: m.poster_path ?? undefined,
        backdropUrl: m.backdrop_path ?? undefined,
        year: m.release_date?.slice(0,4),
        rating: m.vote_average,
    };
}


// query
export async function getPopularMovies(page = 2): Promise<Movie[]> {
  const res = await tmdb.get<TmdbPagedResponse<TmdbMovie>>("/discover/movie", {
    params: { page },
  });

  return res.data.results.map(mapTmdbMovie);
}


//search debounce + abort
export async function searchMovies(query: string, signal?: AbortSignal): Promise<Movie[]> {
    const res = await tmdb.get("/search/movie", { params: { query }, signal });
    return res.data.results.map(mapTmdbMovie)
}



//error state

export function getAxiosErrorInfo(err: unknown) {
  if (axios.isAxiosError(err)) {
    return {
      status: err.response?.status ?? null,
      message:
        err.response?.data?.message ||
        err.message || // Network Error vs
        "Unknown error",
    };
  }
  return { status: null, message: "Unknown error" };
}


// ✅ Movie Detail
export async function getMovieDetail(
  id: number,
  signal?: AbortSignal
): Promise<TmdbMovie> {
  const res = await tmdb.get<TmdbMovie>(`/movie/${id}`, { signal });
  return res.data;
}

// ✅ Movie Credits (Cast)
export async function getMovieCredits(
  id: number,
  signal?: AbortSignal
): Promise<TmdbCastMember[]> {
  const res = await tmdb.get<TmdbCreditsResponse>(`/movie/${id}/credits`, {
    signal,
  });

  // İstersen burada slice(0,10) yapmayalım, sayfada yaparsın.
  return res.data.cast;
}


//filtreleme özelliği

export async function getGenres(): Promise<Genre[]> {
  const res = await tmdb.get<TmdbGenreListResponse>("genre/movie/list");
  return res.data.genres;
}

export async function discoverMovies(opts: {
  page?: number;
  genreIds?: number[];
  sortBy?: "popularity.desc" | "vote_average.desc" | "primary_release_date.desc";
}): Promise<Movie[]> {
  const {
    page = 1,
    genreIds = [],
    sortBy = "popularity.desc",
  } = opts;

  const res = await tmdb.get<TmdbPagedResponse<TmdbMovie>>("/discover/movie", {
    params: {
      page,
      sort_by: sortBy,
      with_genres: genreIds.length ? genreIds.join(",") : undefined,
    },
  });

  return res.data.results.map(mapTmdbMovie);
}
