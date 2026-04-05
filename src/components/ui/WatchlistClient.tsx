'use client'

import { useState } from 'react'
import { useWatchlist } from '@/hooks/useWatchlist'
import { getImageUrl } from '@/lib/tmdb'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import type { Movie } from '@/types/movie'

type Filter = 'ALL' | 'MOVIES' | 'TV SERIES'

export default function WatchlistClient() {
  const { items, toggleWatchlist } = useWatchlist()
  const [filter, setFilter] = useState<Filter>('ALL')

  const filtered = items.filter((item) => {
    if (filter === 'ALL') return true
    if (filter === 'MOVIES') return item.media_type === 'movie' || !item.media_type
    if (filter === 'TV SERIES') return item.media_type === 'tv'
    return true
  })

  return (
    <div className="mx-auto max-w-7xl">

      {/* Header */}
      <div className="mb-10">
        <h1 className="text-5xl font-black tracking-tighter text-white md:text-7xl">
          Watchlist
        </h1>
        <p className="mt-3 text-[10px] uppercase tracking-[0.2em] text-[#484849]">
          {items.length} Items Saved to the Void
        </p>
      </div>

      {/* Filter tabs */}
      <div className="mb-10 flex gap-2">
        {(['ALL', 'MOVIES', 'TV SERIES'] as Filter[]).map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setFilter(tab)}
            aria-pressed={filter === tab}
            className={cn(
              'rounded-sm border px-4 py-1.5 text-[10px] uppercase tracking-[0.1em] transition-all',
              filter === tab
                ? 'border-[#8ff5ff] bg-[#8ff5ff]/10 text-[#8ff5ff]'
                : 'border-[#484849]/15 text-[#484849] hover:border-[#484849]/40 hover:text-white',
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Empty state */}
      {items.length === 0 && (
        <div className="flex flex-col items-center justify-center py-40 text-center">
          <div className="mb-6 rounded border border-[#484849]/15 bg-[#131314] p-5">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#484849" strokeWidth="1" aria-hidden="true">
              <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" />
            </svg>
          </div>
          <p className="text-xs uppercase tracking-[0.15em] text-[#484849]">
            The Void is Empty
          </p>
          <p className="mt-2 text-sm text-[#484849]/60">
            Start adding titles to your watchlist
          </p>
          <Link
            href="/search"
            className="mt-8 rounded-sm border border-[#484849]/15 bg-[#131314] px-6 py-2.5 text-xs uppercase tracking-[0.08em] text-white transition-all hover:border-[#8ff5ff]/30 hover:text-[#8ff5ff]"
          >
            Start Exploring
          </Link>
        </div>
      )}

      {/* Grid */}
      {filtered.length > 0 && (
        <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
          {filtered.map((movie) => (
            <WatchlistCard
              key={movie.id}
              movie={movie}
              onRemove={() => toggleWatchlist(movie)}
            />
          ))}

          {/* Space for More card */}
          <div className="flex flex-col items-center justify-center rounded border border-[#484849]/10 bg-[#131314]/40 p-8 text-center">
            <div className="mb-4 rounded border border-[#484849]/15 bg-[#201f21] p-3">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#484849" strokeWidth="1" aria-hidden="true">
                <rect x="3" y="3" width="7" height="7" />
                <rect x="14" y="3" width="7" height="7" />
                <rect x="3" y="14" width="7" height="7" />
                <rect x="14" y="14" width="7" height="7" />
              </svg>
            </div>
            <p className="text-[10px] uppercase tracking-[0.15em] text-[#484849]">
              Space for More
            </p>
            <p className="mt-2 text-xs text-[#484849]/60">
              Continue your journey through the celestial library
            </p>
            <Link
              href="/search"
              className="mt-5 rounded-sm border border-[#484849]/15 bg-[#131314] px-4 py-2 text-[10px] uppercase tracking-[0.08em] text-white transition-all hover:border-[#8ff5ff]/30 hover:text-[#8ff5ff]"
            >
              Start Exploring
            </Link>
          </div>
        </div>
      )}

    </div>
  )
}

interface WatchlistCardProps {
  movie: Movie
  onRemove: () => void
}

function WatchlistCard({ movie, onRemove }: WatchlistCardProps) {
  const poster = getImageUrl(movie.poster_path, 'w500')
  const mediaType = movie.media_type === 'tv' ? 'Series' : 'Movie'

  return (
    <div className="group relative overflow-hidden rounded border border-[#484849]/10 bg-[#131314]">

      {/* Poster */}
      <Link href={`/movie/${movie.id}`} aria-label={`View ${movie.title || movie.name}`}>
        <div className="aspect-[2/3] overflow-hidden">
          <img
            src={poster}
            alt={movie.title || movie.name || ''}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
      </Link>

      {/* Remove button */}
      <button
        type="button"
        onClick={onRemove}
        aria-label={`Remove ${movie.title || movie.name} from watchlist`}
        className="absolute right-2 top-2 rounded-sm border border-[#484849]/15 bg-[#0e0e0f]/80 p-1.5 text-[#484849] opacity-0 backdrop-blur-sm transition-all group-hover:opacity-100 hover:border-red-500/30 hover:text-red-400"
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <path d="M18 6L6 18M6 6l12 12" />
        </svg>
      </button>

      {/* Info */}
      <div className="p-4">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-[9px] uppercase tracking-[0.15em] text-[#8ff5ff]">
            {mediaType}
          </span>
          <div className="flex items-center gap-1">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="#8ff5ff" aria-hidden="true">
              <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
            </svg>
            <span className="text-[10px] text-white">
              {movie.vote_average.toFixed(1)}
            </span>
          </div>
        </div>
        <p className="text-sm font-bold uppercase tracking-tight text-white">
          {movie.title || movie.name}
        </p>
      </div>

    </div>
  )
}