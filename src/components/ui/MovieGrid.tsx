import MovieCard from "./MovieCard";
import type { Movie } from "@/types/movie";

interface MovieGridProps {
  movies: Movie[];
  className?: string;
}

export default function MovieGrid({ movies, className }: MovieGridProps) {
  if (!movies.length) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <p className="text-on-surface-variant tracking-[0.1em] uppercase text-sm">
          No results found
        </p>
      </div>
    );
  }

  return (
    <div
      className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 ${className}`}
    >
      {movies.map((movie) => (
        <MovieCard key={movie.id} movie={movie} />
      ))}
    </div>
  );
}
