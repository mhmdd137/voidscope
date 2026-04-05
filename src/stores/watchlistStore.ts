import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Movie } from "@/types/movie";

interface WatchlistState {
  items: Movie[];
  addToWatchlist: (movie: Movie) => void;
  removeFromWatchlist: (id: number) => void;
  isInWatchlist: (id: number) => boolean;
  clearWatchlist: () => void;
}

export const useWatchlistStore = create<WatchlistState>()(
  persist(
    (set, get) => ({
      items: [],

      addToWatchlist: (movie) => {
        const already = get().isInWatchlist(movie.id);
        if (already) return;
        set((state) => ({ items: [...state.items, movie] }));
      },

      removeFromWatchlist: (id) => {
        set((state) => ({
          items: state.items.filter((m) => m.id !== id),
        }));
      },

      isInWatchlist: (id) => {
        return get().items.some((m) => m.id === id);
      },

      clearWatchlist: () => set({ items: [] }),
    }),
    {
      name: "voidscope-watchlist",
    }
  )
);