import Link from "next/link";
import Image from "next/image";
import { getImageUrl } from "@/lib/tmdb";
import type { Movie } from "@/types/movie";

interface MovieCardProps {
  movie: Movie;
}

export default function MovieCard({ movie }: MovieCardProps) {
  const poster = getImageUrl(movie.poster_path, "w500");
  const title = movie.title || movie.name || "Untitled";
  const mediaType = movie.media_type || "movie";

  return (
    <Link
      href={`/movie/${movie.id}`}
      aria-label={`View ${title}`}
      className="group relative overflow-hidden rounded border border-[#484849]/10 bg-[#131314] block"
    >
      <div className="relative aspect-[2/3] overflow-hidden bg-[#1a1a1b]">
        <Image
          src={poster}
          alt={title}
          fill
          sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          placeholder="blur"
          blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=="
        />
      </div>

      <div className="absolute inset-0 bg-gradient-to-t from-[#0e0e0f] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div className="p-3">
        <div className="mb-1 flex items-center justify-between">
          <span className="text-[9px] uppercase tracking-[0.15em] text-[#8ff5ff]">
            {mediaType === "tv" ? "Series" : "Film"}
          </span>
          <div className="flex items-center gap-1">
            <svg
              width="10"
              height="10"
              viewBox="0 0 24 24"
              fill="#8ff5ff"
              aria-hidden="true"
            >
              <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
            </svg>
            <span className="text-[10px] text-white">
              {movie.vote_average?.toFixed(1) || "0.0"}
            </span>
          </div>
        </div>
        <p className="text-sm font-bold uppercase tracking-tight text-white truncate">
          {title}
        </p>
      </div>
    </Link>
  );
}
