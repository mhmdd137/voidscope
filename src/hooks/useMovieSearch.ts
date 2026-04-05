import { useQuery } from "@tanstack/react-query";
import { searchMovies } from "@/lib/tmdb";

export function useMovieSearch(query: string, page: number = 1) {
  return useQuery({
    queryKey: ["search", query, page],
    queryFn: () => searchMovies(query, page),
    enabled: query.trim().length > 0,
    placeholderData: (prev) => prev,
  });
}