import { create } from 'zustand'
import type { MediaType, SortOption } from '@/types/movie'

export interface FilterState {
  mediaType: MediaType
  genreId: string
  rating: string
  year: string
  sort: SortOption
}

interface FilterStore extends FilterState {
  setFilter: <K extends keyof FilterState>(key: K, value: FilterState[K]) => void
  resetFilters: () => void
}

const DEFAULT_FILTERS: FilterState = {
  mediaType: 'movie',
  genreId: '',
  rating: '',
  year: '',
  sort: 'popularity.desc',
}

/**
 * Zustand store for the global filter state.
 * Consumed by FilterBar and SearchResults to keep them in sync.
 *
 * Note: URL search params remain the source of truth for SSR.
 * This store reflects the client-side selection so FilterBar dropdowns stay
 * controlled without full page reloads as the user picks each filter.
 */
export const useFilterStore = create<FilterStore>((set) => ({
  ...DEFAULT_FILTERS,

  setFilter: (key, value) =>
    set((state) => ({
      ...state,
      [key]: value,
      // When media type changes, reset genre (genres differ between movie/tv)
      ...(key === 'mediaType' ? { genreId: '' } : {}),
    })),

  resetFilters: () => set(DEFAULT_FILTERS),
}))
