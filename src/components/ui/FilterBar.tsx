'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState, useCallback, useTransition } from 'react'
import { useFilterStore } from '@/stores/filterStore'
import { cn } from '@/lib/utils'
import type { Genre, MediaType, SortOption } from '@/types/movie'

// ── Static option sets ────────────────────────────────────────────────────────

const MEDIA_TYPE_OPTIONS = [
  { label: '🎬 Movies', value: 'movie' },
  { label: '📺 TV Shows', value: 'tv' },
] as const

const RATING_OPTIONS = [
  { label: 'Any Rating', value: '' },
  { label: '5+ Stars', value: '5' },
  { label: '6+ Stars', value: '6' },
  { label: '7+ Stars', value: '7' },
  { label: '8+ Stars', value: '8' },
  { label: '9+ Stars', value: '9' },
]

const SORT_OPTIONS: { label: string; value: SortOption }[] = [
  { label: 'Popularity ↓', value: 'popularity.desc' },
  { label: 'Popularity ↑', value: 'popularity.asc' },
  { label: 'Rating ↓', value: 'vote_average.desc' },
  { label: 'Rating ↑', value: 'vote_average.asc' },
  { label: 'Newest First', value: 'release_date.desc' },
  { label: 'Oldest First', value: 'release_date.asc' },
]

// Build year list: current year → 1970
function buildYearOptions() {
  const currentYear = new Date().getFullYear()
  const years: { label: string; value: string }[] = [
    { label: 'Any Year', value: '' },
  ]
  for (let y = currentYear; y >= 1970; y--) {
    years.push({ label: String(y), value: String(y) })
  }
  return years
}
const YEAR_OPTIONS = buildYearOptions()

// ── Props ─────────────────────────────────────────────────────────────────────

interface FilterBarProps {
  /** Initial genres from SSR (for the default media type) */
  initialGenres: Genre[]
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function FilterBar({ initialGenres }: FilterBarProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  const { mediaType, genreId, rating, year, sort, setFilter } =
    useFilterStore()

  const [genres, setGenres] = useState<Genre[]>(initialGenres)
  const [genresLoading, setGenresLoading] = useState(false)

  // ── Initialise store from URL on mount ──────────────────────────────────
  useEffect(() => {
    const mt = (searchParams.get('mediaType') ?? 'movie') as MediaType
    const g = searchParams.get('genre') ?? ''
    const r = searchParams.get('rating') ?? ''
    const y = searchParams.get('year') ?? ''
    const s = (searchParams.get('sort') ?? 'popularity.desc') as SortOption

    setFilter('mediaType', mt)
    setFilter('genreId', g)
    setFilter('rating', r)
    setFilter('year', y)
    setFilter('sort', s)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // ── Re-fetch genres when media type changes ─────────────────────────────
  useEffect(() => {
    let cancelled = false
    setGenresLoading(true)

    fetch(`/api/genres?mediaType=${mediaType}`)
      .then((res) => res.json())
      .then((data: Genre[]) => {
        if (!cancelled) setGenres(data)
      })
      .catch(() => {
        if (!cancelled) setGenres([])
      })
      .finally(() => {
        if (!cancelled) setGenresLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [mediaType])

  // ── Push all current filter values to URL ───────────────────────────────
  const pushToUrl = useCallback(
    (overrides: Partial<{
      mediaType: string
      genre: string
      rating: string
      year: string
      sort: string
    }>) => {
      const params = new URLSearchParams(searchParams.toString())
      const q = params.get('q') // preserve search query

      // Build fresh params from store + overrides
      const next = {
        mediaType,
        genre: genreId,
        rating,
        year,
        sort,
        ...overrides,
      }

      params.delete('q')
      params.delete('mediaType')
      params.delete('genre')
      params.delete('rating')
      params.delete('year')
      params.delete('sort')

      if (q) params.set('q', q)
      if (next.mediaType) params.set('mediaType', next.mediaType)
      if (next.genre) params.set('genre', next.genre)
      if (next.rating) params.set('rating', next.rating)
      if (next.year) params.set('year', next.year)
      if (next.sort) params.set('sort', next.sort)

      startTransition(() => {
        router.replace(`/search?${params.toString()}`)
      })
    },
    [searchParams, mediaType, genreId, rating, year, sort, router]
  )

  // ── Generic handler ─────────────────────────────────────────────────────
  function handleChange(
    key: keyof ReturnType<typeof useFilterStore.getState>,
    urlKey: string,
    value: string
  ) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setFilter(key as any, value as any)
    if (key === 'mediaType') {
      // Reset genre when media type changes
      setFilter('genreId', '')
      pushToUrl({ [urlKey]: value, genre: '' })
    } else {
      pushToUrl({ [urlKey]: value })
    }
  }

  const hasActiveFilters =
    genreId !== '' || rating !== '' || year !== '' || sort !== 'popularity.desc'

  return (
    <div
      role="group"
      aria-label="Content filters"
      className="relative"
    >
      {/* Glass container */}
      <div className={cn(
        'flex flex-wrap items-center gap-3 rounded-lg p-4',
        'border border-[#484849]/20 bg-[#131314]/80 backdrop-blur-md',
        isPending && 'opacity-75 transition-opacity',
      )}>

        {/* ── Media Type ────────────────────────────────────── */}
        <div className="flex items-center gap-2">
          <FilterLabel>Type</FilterLabel>
          <div className="flex rounded overflow-hidden border border-[#484849]/25">
            {MEDIA_TYPE_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                aria-pressed={mediaType === opt.value}
                onClick={() => handleChange('mediaType', 'mediaType', opt.value)}
                className={cn(
                  'px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.08em] transition-all duration-200',
                  mediaType === opt.value
                    ? 'bg-[#8ff5ff]/15 text-[#8ff5ff] shadow-[inset_0_0_12px_rgba(143,245,255,0.08)]'
                    : 'bg-transparent text-[#767576] hover:text-white hover:bg-[#201f21]'
                )}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="hidden sm:block h-6 w-px bg-[#484849]/30" />

        {/* ── Genre ─────────────────────────────────────────── */}
        <div className="flex items-center gap-2">
          <FilterLabel>Genre</FilterLabel>
          <FilterSelect
            id="filter-genre"
            aria-label="Filter by genre"
            value={genreId}
            onChange={(v) => handleChange('genreId', 'genre', v)}
            disabled={genresLoading}
          >
            <option value="">
              {genresLoading ? 'Loading...' : 'All Genres'}
            </option>
            {genres.map((g) => (
              <option key={g.id} value={String(g.id)}>
                {g.name}
              </option>
            ))}
          </FilterSelect>
        </div>

        {/* ── Rating ────────────────────────────────────────── */}
        <div className="flex items-center gap-2">
          <FilterLabel>Rating</FilterLabel>
          <FilterSelect
            id="filter-rating"
            aria-label="Filter by minimum rating"
            value={rating}
            onChange={(v) => handleChange('rating', 'rating', v)}
          >
            {RATING_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </FilterSelect>
        </div>

        {/* ── Year ──────────────────────────────────────────── */}
        <div className="flex items-center gap-2">
          <FilterLabel>Year</FilterLabel>
          <FilterSelect
            id="filter-year"
            aria-label="Filter by release year"
            value={year}
            onChange={(v) => handleChange('year', 'year', v)}
          >
            {YEAR_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </FilterSelect>
        </div>

        {/* Divider */}
        <div className="hidden sm:block h-6 w-px bg-[#484849]/30" />

        {/* ── Sort ──────────────────────────────────────────── */}
        <div className="flex items-center gap-2 ml-auto">
          <FilterLabel>Sort</FilterLabel>
          <FilterSelect
            id="filter-sort"
            aria-label="Sort results"
            value={sort}
            onChange={(v) =>
              handleChange('sort', 'sort', v)
            }
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </FilterSelect>
        </div>

        {/* ── Reset ─────────────────────────────────────────── */}
        {hasActiveFilters && (
          <button
            type="button"
            aria-label="Reset all filters"
            onClick={() => {
              setFilter('genreId', '')
              setFilter('rating', '')
              setFilter('year', '')
              setFilter('sort', 'popularity.desc')
              pushToUrl({ genre: '', rating: '', year: '', sort: 'popularity.desc' })
            }}
            className={cn(
              'ml-1 flex items-center gap-1.5 rounded px-3 py-2',
              'text-[11px] font-semibold uppercase tracking-[0.08em]',
              'border border-[#484849]/25 text-[#767576]',
              'hover:border-red-500/40 hover:text-red-400 transition-all duration-200',
            )}
          >
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
            Reset
          </button>
        )}

        {/* Scanning indicator */}
        {isPending && (
          <span
            aria-live="polite"
            className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] uppercase tracking-widest text-[#8ff5ff] animate-pulse"
          >
            Scanning…
          </span>
        )}
      </div>

      {/* Active filter pills summary */}
      {hasActiveFilters && (
        <div className="mt-2 flex flex-wrap gap-1.5 px-1" aria-label="Active filters">
          {genreId && (
            <ActivePill
              label={genres.find((g) => String(g.id) === genreId)?.name ?? `Genre ${genreId}`}
              onRemove={() => handleChange('genreId', 'genre', '')}
            />
          )}
          {rating && (
            <ActivePill label={`${rating}+ Stars`} onRemove={() => handleChange('rating', 'rating', '')} />
          )}
          {year && (
            <ActivePill label={year} onRemove={() => handleChange('year', 'year', '')} />
          )}
          {sort !== 'popularity.desc' && (
            <ActivePill
              label={SORT_OPTIONS.find((s) => s.value === sort)?.label ?? sort}
              onRemove={() => handleChange('sort', 'sort', 'popularity.desc')}
            />
          )}
        </div>
      )}
    </div>
  )
}

// ── Sub-components ────────────────────────────────────────────────────────────

function FilterLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="hidden sm:inline text-[10px] uppercase tracking-[0.12em] text-[#484849] whitespace-nowrap select-none">
      {children}
    </span>
  )
}

interface FilterSelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'onChange'> {
  children: React.ReactNode
  onChange: (value: string) => void
}

function FilterSelect({ children, onChange, className, ...props }: FilterSelectProps) {
  return (
    <div className="relative">
      <select
        {...props}
        onChange={(e) => onChange(e.target.value)}
        className={cn(
          'filter-select appearance-none',
          'rounded bg-[#1a191b] py-2 pl-3 pr-8',
          'text-[11px] uppercase tracking-[0.08em] text-white',
          'border border-[#484849]/25',
          'focus:outline-none focus:border-[#8ff5ff]/60 focus:ring-1 focus:ring-[#8ff5ff]/20',
          'cursor-pointer transition-all duration-200',
          'disabled:opacity-40 disabled:cursor-not-allowed',
          'hover:border-[#484849]/50',
          className,
        )}
      >
        {children}
      </select>
      {/* Chevron */}
      <svg
        className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[#484849]"
        width="10"
        height="10"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        aria-hidden="true"
      >
        <polyline points="6 9 12 15 18 9" />
      </svg>
    </div>
  )
}

function ActivePill({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span className={cn(
      'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5',
      'text-[10px] uppercase tracking-[0.06em]',
      'bg-[#8ff5ff]/10 text-[#8ff5ff] border border-[#8ff5ff]/20',
    )}>
      {label}
      <button
        type="button"
        aria-label={`Remove ${label} filter`}
        onClick={onRemove}
        className="ml-0.5 hover:text-white transition-colors"
      >
        <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" aria-hidden="true">
          <path d="M18 6 6 18M6 6l12 12" />
        </svg>
      </button>
    </span>
  )
}