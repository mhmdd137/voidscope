import { useWatchlistStore } from '@/stores/watchlistStore'
import type { Movie } from '@/types/movie'

export function useWatchlist() {
  const { items, addToWatchlist, removeFromWatchlist, isInWatchlist, clearWatchlist } =
    useWatchlistStore()

  const toggleWatchlist = (movie: Movie) => {
    if (isInWatchlist(movie.id)) {
      removeFromWatchlist(movie.id)
    } else {
      addToWatchlist(movie)
    }
  }

  return {
    items,
    watchlist: items,
    addToWatchlist,
    removeFromWatchlist,
    toggleWatchlist,
    isInWatchlist,
    clearWatchlist,
    count: items.length,
  }
}