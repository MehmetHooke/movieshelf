import { useQuery } from "@tanstack/react-query";
import { searchMovies } from "../services/movieService";
import type { Movie } from "../types/movie";

export function useSearchMovies(searchTerm: string) {
  const trimmed = searchTerm.trim();

  return useQuery<Movie[], Error>({
    queryKey: ["search-movies", trimmed],
    enabled: trimmed.length > 0,
    queryFn: async ({ signal }) => {
      await new Promise((resolve) => setTimeout(resolve, 400));
      return searchMovies(trimmed, signal);
    },
    placeholderData: (prev) => prev,
    staleTime: 1000 * 30,
  });
}
