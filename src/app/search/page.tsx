import { Suspense } from 'react'
import SearchBar from '@/components/ui/SearchBar'
import FilterBar from '@/components/ui/FilterBar'
import SearchResults from '@/components/ui/SearchResults'
import { searchMovies, getGenres } from '@/lib/tmdb'

interface SearchPageProps {
  searchParams: Promise<{
    q?: string
    genre?: string
    year?: string
    rating?: string
    sort?: string
  }>
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams

  const query = params.q ?? ''
  const genreId = params.genre ?? ''
  const year = params.year ?? ''
  const rating = params.rating ?? ''
  const sort = params.sort ?? 'popularity.desc'

  const [genres, initialResults] = await Promise.all([
    getGenres(),
    searchMovies(query, 1, { genreId, year, sort, rating }),
  ])

  return (
    <main className="min-h-screen bg-[#0e0e0f] px-6 py-10 md:px-12 lg:px-24">
      <section className="mb-8">
        <SearchBar initialQuery={query} />
      </section>

      <section className="mb-10">
        <FilterBar
          genres={genres}
          activeGenre={genreId}
          activeYear={year}
          activeRating={rating}
          activeSort={sort}
        />
      </section>

      <Suspense fallback={<SearchResultsSkeleton />}>
        <SearchResults
          initialResults={initialResults}
          query={query}
          genreId={genreId}
          year={year}
          rating={rating}
          sort={sort}
        />
      </Suspense>
    </main>
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