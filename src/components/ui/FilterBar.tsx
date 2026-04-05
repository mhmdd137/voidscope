'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { cn } from '@/lib/utils'
import type { Genre } from '@/types/movie'

interface FilterBarProps {
  genres: Genre[]
  activeGenre: string
  activeYear: string
  activeRating: string
  activeSort: string
}

const YEARS = ['2024', '2023', '2022', '2021', '2020']
const RATINGS = ['9.0+', '8.0+', '7.0+', '6.0+']
const SORT_OPTIONS = [
  { label: 'Trending', value: 'popularity.desc' },
  { label: 'Top Rated', value: 'vote_average.desc' },
  { label: 'Newest', value: 'release_date.desc' },
  { label: 'Oldest', value: 'release_date.asc' },
]

export default function FilterBar({
  genres,
  activeGenre,
  activeYear,
  activeRating,
  activeSort,
}: FilterBarProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  function updateParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString())

    if (params.get(key) === value) {
      params.delete(key)
    } else {
      params.set(key, value)
    }

    router.replace(`/search?${params.toString()}`)
  }

  return (
    <div
      role="group"
      aria-label="Search filters"
      className="flex flex-wrap items-center gap-2"
    >

      {/* Genre chips */}
      {genres.slice(0, 6).map((genre) => (
        <FilterChip
          key={genre.id}
          label={`Genre: ${genre.name}`}
          active={activeGenre === String(genre.id)}
          onClick={() => updateParam('genre', String(genre.id))}
        />
      ))}

      {/* Year chips */}
      {YEARS.map((year) => (
        <FilterChip
          key={year}
          label={`Year: ${year}`}
          active={activeYear === year}
          onClick={() => updateParam('year', year)}
        />
      ))}

      {/* Rating chips */}
      {RATINGS.map((rating) => (
        <FilterChip
          key={rating}
          label={`Rating: ${rating}`}
          active={activeRating === rating}
          onClick={() => updateParam('rating', rating)}
        />
      ))}

      {/* Sort select */}
      <div className="relative ml-auto">
        <select
          aria-label="Sort results"
          value={activeSort}
          onChange={(e) => updateParam('sort', e.target.value)}
          className={cn(
            'appearance-none rounded bg-[#131314] py-2 pl-4 pr-8',
            'text-xs uppercase tracking-[0.08em] text-[#8ff5ff]',
            'border border-[#484849]/15',
            'focus:outline-none focus:border-[#8ff5ff]',
            'cursor-pointer transition-colors',
          )}
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              Sort: {opt.label}
            </option>
          ))}
        </select>

        {/* Chevron */}
        <svg
          className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-[#8ff5ff]"
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          aria-hidden="true"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </div>

    </div>
  )
}

interface FilterChipProps {
  label: string
  active: boolean
  onClick: () => void
}

function FilterChip({ label, active, onClick }: FilterChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        'rounded px-3 py-1.5',
        'text-xs uppercase tracking-[0.08em]',
        'border transition-all duration-150',
        active
          ? 'border-[#00dcfc] bg-[#00dcfc]/10 text-[#00dcfc]'
          : 'border-[#484849]/15 bg-transparent text-[#484849] hover:border-[#484849]/40 hover:text-white',
      )}
    >
      {label}
    </button>
  )
}