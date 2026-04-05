import { getTrending } from "@/lib/tmdb";
import { getImageUrl } from "@/lib/tmdb";
import MovieGrid from "@/components/ui/MovieGrid";
import Link from "next/link";
import type { Movie } from "@/types/movie";
import WatchlistBtn from "@/components/ui/WatchlistBtn";

export default async function Home() {
  const trending = await getTrending();
  const featured: Movie = trending[0];
  const rest: Movie[] = trending.slice(1);

  return (
    <div className="relative min-h-screen">
      {/* Nebula Glows */}
      <div className="nebula-glow fixed top-20 -left-40" />
      <div className="nebula-glow fixed bottom-40 -right-40" />

      {/* Hero Section */}
      <section className="relative h-[85vh] flex items-end">
        {/* Backdrop */}
        <div className="absolute inset-0 z-0">
          <img
            src={getImageUrl(featured.backdrop_path, "original")}
            alt={featured.title || featured.name || ""}
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0e0e0f] via-[#0e0e0f]/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0e0e0f]/80 via-transparent to-transparent" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-8 pb-16 w-full">
          <div className="max-w-2xl space-y-6">
            {/* Label */}
            <div className="flex gap-4 items-center">
              <span className="glass-edge text-primary tracking-[0.2em] text-[10px] font-bold uppercase py-1 px-3 bg-surface-container-high/40 backdrop-blur-md rounded-sm">
                FEATURED PULSE
              </span>
              <span className="text-on-surface-variant tracking-[0.1em] text-[10px] uppercase">
                {featured.media_type === "tv" ? "TV Series" : "Feature Film"}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-none text-on-surface">
              {(featured.title || featured.name || "").toUpperCase()}
            </h1>

            {/* Overview */}
            <p className="text-on-surface-variant text-lg font-light leading-relaxed max-w-xl">
              {featured.overview.slice(0, 150)}...
            </p>

            {/* Rating */}
            <div className="flex items-center gap-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="#8ff5ff" stroke="none">
                <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>
              </svg>
              <span className="text-primary font-bold text-xl">
                {featured.vote_average.toFixed(1)}
              </span>
              <span className="text-on-surface-variant text-sm">/ 10</span>
            </div>

            {/* Actions */}
            <div className="flex gap-4 pt-2">
              <Link
                href={`/${featured.media_type || "movie"}/${featured.id}`}
                className="bg-primary text-on-primary px-10 py-3 rounded-sm font-bold tracking-[0.05em] uppercase text-sm hover:shadow-[0_0_20px_rgba(143,245,255,0.3)] transition-all active:scale-95"
              >
                View Details
              </Link>
<WatchlistBtn movie={featured} />

            </div>
          </div>
        </div>
      </section>

      {/* Trending Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-8 py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-[10px] tracking-[0.2em] text-on-surface-variant uppercase mb-1">
              Technical Scan
            </p>
            <h2 className="text-2xl font-black tracking-tight text-on-surface">
              Trending Destinations
            </h2>
          </div>
          <Link
            href="/search"
            className="text-[10px] tracking-[0.15em] text-primary uppercase hover:text-primary-dim transition-colors"
          >
            View All →
          </Link>
        </div>

        <MovieGrid movies={rest} />
      </section>
    </div>
  );
}