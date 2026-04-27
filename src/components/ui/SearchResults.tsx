'use client'

import { useInfiniteQuery } from '@tanstack/react-query'
import MovieGrid from '@/components/ui/MovieGrid'
import type { Movie, MediaType } from '@/types/movie'

interface SearchResultsProps {
  initialResults: Movie[]
  query: string
  mediaType: MediaType
  genreId: string
  year: string
  rating: string
  sort: string
}

export default function SearchResults({
  initialResults,
  query,
  mediaType,
  genreId,
  year,
  rating,
  sort,
}: SearchResultsProps) {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteQuery({
      queryKey: ['search', query, mediaType, genreId, year, rating, sort],
      queryFn: async ({ pageParam = 1 }) => {
        const params = new URLSearchParams()
        if (query) params.set('q', query)
        params.set('mediaType', mediaType)
        if (genreId) params.set('genre', genreId)
        if (year) params.set('year', year)
        if (sort) params.set('sort', sort)
        if (rating) params.set('rating', rating)
        params.set('page', String(pageParam))

        const res = await fetch(`/api/search?${params.toString()}`)
        if (!res.ok) throw new Error('Search failed')
        return (await res.json()) as Movie[]
      },
      initialPageParam: 1,
      getNextPageParam: (lastPage, pages) =>
        lastPage.length > 0 ? pages.length + 1 : undefined,
      placeholderData: { pages: [initialResults], pageParams: [1] },
    })

  const movies = data?.pages.flat() ?? []

  // ── Loading skeleton ────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="aspect-[2/3] animate-pulse rounded bg-[#201f21]"
          />
        ))}
      </div>
    )
  }

  // ── Empty state ─────────────────────────────────────────────────────────
  if (movies.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center">
        <div className="mb-4 text-4xl opacity-30">📡</div>
        <p className="text-xs uppercase tracking-[0.1em] text-[#484849]">
          No Signal Detected
        </p>
        <p className="mt-2 text-sm text-[#484849]/60">
          Try adjusting your scan parameters or switching the media type
        </p>
      </div>
    )
  }

  // ── Results ─────────────────────────────────────────────────────────────
  return (
    <section aria-label="Search results">
      {/* Result count */}
      <p className="mb-5 text-[10px] uppercase tracking-[0.1em] text-[#484849]">
        {movies.length} result{movies.length !== 1 ? 's' : ''} detected
      </p>

      <MovieGrid movies={movies} />

      {hasNextPage && (
        <div className="mt-12 flex justify-center">
          <button
            type="button"
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
            className="flex items-center gap-3 rounded border border-[#484849]/15 bg-[#131314] px-8 py-3 text-xs uppercase tracking-[0.1em] text-white transition-all hover:border-[#8ff5ff]/30 hover:text-[#8ff5ff] disabled:opacity-50"
          >
            {isFetchingNextPage ? 'Scanning...' : 'Scan Deeper'}
            {!isFetchingNextPage && (
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden="true"
              >
                <polyline points="7 13 12 18 17 13" />
                <polyline points="7 6 12 11 17 6" />
              </svg>
            )}
          </button>
        </div>
      )}
    </section>
  )
}