import { useQuery } from "@tanstack/react-query";
import { discoverMovies } from "../services/movieService";
import type { Movie } from "../types/movie";

export function useDiscoverMovies(page: number, genreIds: number[]) {
  return useQuery<Movie[], Error>({
    queryKey: ["discover-movies", page, genreIds],
    queryFn: () => discoverMovies({ page, genreIds }),
    staleTime: 1000 * 30,
    placeholderData: (prev) => prev,
  });
}
