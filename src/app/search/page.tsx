import { Suspense } from 'react'
import SearchBar from '@/components/ui/SearchBar'
import FilterBar from '@/components/ui/FilterBar'
import SearchResults from '@/components/ui/SearchResults'
import { searchMovies, getGenresByMediaType } from '@/lib/tmdb'
import type { MediaType, SortOption } from '@/types/movie'

interface SearchPageProps {
  searchParams: Promise<{
    q?: string
    mediaType?: string
    genre?: string
    year?: string
    rating?: string
    sort?: string
  }>
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams

  const query = params.q ?? ''
  const mediaType: MediaType = params.mediaType === 'tv' ? 'tv' : 'movie'
  const genreId = params.genre ?? ''
  const year = params.year ?? ''
  const rating = params.rating ?? ''
  const sort = (params.sort ?? 'popularity.desc') as SortOption

  // Parallel SSR: fetch genres for the current media type + initial results
  const [genres, initialResults] = await Promise.all([
    getGenresByMediaType(mediaType),
    searchMovies(query, 1, { mediaType, genreId, year, sort, rating }),
  ])

  return (
    <main className="min-h-screen bg-[#0e0e0f] px-6 py-10 md:px-12 lg:px-24">
      {/* Nebula glows */}
      <div className="nebula-glow fixed top-20 -left-40 pointer-events-none" />
      <div className="nebula-glow fixed bottom-40 -right-40 pointer-events-none" />

      {/* Page header */}
      <section className="mb-8">
        <p className="mb-1 text-[10px] uppercase tracking-[0.2em] text-[#484849]">
          Nebula Scan
        </p>
        <h1 className="mb-6 text-3xl font-black tracking-tight text-white">
          {query ? (
            <>
              Results for{' '}
              <span className="text-[#8ff5ff]">&ldquo;{query}&rdquo;</span>
            </>
          ) : (
            <>
              {mediaType === 'tv' ? 'TV Show' : 'Movie'}{' '}
              <span className="text-[#8ff5ff]">Discovery</span>
            </>
          )}
        </h1>
        <SearchBar initialQuery={query} />
      </section>

      {/* Filter bar */}
      <section className="mb-10">
        <Suspense fallback={<FilterBarSkeleton />}>
          <FilterBar initialGenres={genres} />
        </Suspense>
      </section>

      {/* Results */}
      <Suspense fallback={<SearchResultsSkeleton />}>
        <SearchResults
          initialResults={initialResults}
          query={query}
          mediaType={mediaType}
          genreId={genreId}
          year={year}
          rating={rating}
          sort={sort}
        />
      </Suspense>
    </main>
  )
}

// ── Skeletons ─────────────────────────────────────────────────────────────────

function FilterBarSkeleton() {
  return (
    <div className="h-14 animate-pulse rounded-lg bg-[#131314] border border-[#484849]/20" />
  )
}

function SearchResultsSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="aspect-[2/3] animate-pulse rounded bg-[#201f21]" />
      ))}
    </div>
  )
}