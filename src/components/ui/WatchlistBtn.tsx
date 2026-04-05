'use client'

import { useWatchlist } from '@/hooks/useWatchlist'
import { cn } from '@/lib/utils'
import type { Movie } from '@/types/movie'

interface WatchlistBtnProps {
  movie: Movie
}

export default function WatchlistBtn({ movie }: WatchlistBtnProps) {
  const { isInWatchlist, addToWatchlist, removeFromWatchlist } = useWatchlist()
  const saved = isInWatchlist(movie.id)

  function handleClick() {
    if (saved) {
      removeFromWatchlist(movie.id)
    } else {
      addToWatchlist(movie)
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={saved ? 'Remove from watchlist' : 'Add to watchlist'}
      aria-pressed={saved}
      className={cn(
        'flex items-center gap-2 rounded-sm border px-8 py-3',
        'text-sm font-bold uppercase tracking-[0.05em] transition-all active:scale-95',
        saved
          ? 'border-[#8ff5ff]/40 bg-[#8ff5ff]/10 text-[#8ff5ff]'
          : 'border-[#484849]/15 bg-transparent text-white hover:bg-[#201f21]/20',
      )}
    >
      {saved ? (
        <>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" />
          </svg>
          Saved
        </>
      ) : (
        <>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
            <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" />
          </svg>
          + Watchlist
        </>
      )}
    </button>
  )
}