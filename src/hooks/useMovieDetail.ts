import { useQuery } from "@tanstack/react-query";
import { getMovieDetail } from "@/lib/tmdb";

export function useMovieDetail(id: number, mediaType: "movie" | "tv" = "movie") {
  return useQuery({
    queryKey: ["movie", id, mediaType],
    queryFn: () => getMovieDetail(id, mediaType),
    enabled: !!id,
  });
}