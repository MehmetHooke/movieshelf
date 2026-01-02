import { useQuery } from "@tanstack/react-query";
import { getGenres } from "../services/movieService";
import type { Genre } from "../types/tmdb";

export function useGenres() {
  return useQuery<Genre[], Error>({
    queryKey: ["genres"],
    queryFn: getGenres,
    staleTime: 1000 * 60 * 60, // 1 saat yeterli olur film türleri için
  });
}
