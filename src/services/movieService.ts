import axios from "axios";
import { tmdb } from "../api/tmdb";
import type { Movie } from "../types/movie";
import type { TmdbCastMember, TmdbCreditsResponse, TmdbMovie, TmdbPagedResponse } from "../types/tmdb";

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


export async function getPopularMovies(): Promise<Movie[]> {
    const res = await tmdb.get<TmdbPagedResponse<TmdbMovie>>('/discover/movie');
    return res.data.results.map(mapTmdbMovie)
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