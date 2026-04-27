import axios from 'axios'
import type {
  Movie,
  MovieDetail,
  TMDBResponse,
  MediaType,
  SortOption,
  DiscoverParams,
} from '@/types/movie'

const tmdb = axios.create({
  baseURL: process.env.TMDB_BASE_URL,
  params: {
    api_key: process.env.TMDB_API_KEY,
    language: 'en-US',
  },
})

export const IMAGE_URL = process.env.NEXT_PUBLIC_TMDB_IMAGE_URL

// ── Images ────────────────────────────────────────────────────────────────────

export function getImageUrl(
  path: string | null,
  size: 'w92' | 'w300' | 'w500' | 'w780' | 'original' = 'w500'
): string {
  if (!path) return '/placeholder.jpg'
  return `${IMAGE_URL}/${size}${path}`
}

// ── Trending ──────────────────────────────────────────────────────────────────

export async function getTrending(): Promise<Movie[]> {
  const { data } = await tmdb.get<TMDBResponse<Movie>>('/trending/all/week')
  return data.results
}

// ── Genres ────────────────────────────────────────────────────────────────────

/**
 * Fetch genres for a specific media type.
 * Calls /genre/movie/list or /genre/tv/list accordingly.
 */
export async function getGenresByMediaType(
  mediaType: MediaType
): Promise<{ id: number; name: string }[]> {
  const endpoint =
    mediaType === 'tv' ? '/genre/tv/list' : '/genre/movie/list'
  const { data } = await tmdb.get<{ genres: { id: number; name: string }[] }>(
    endpoint
  )
  return data.genres
}

/** @deprecated Use getGenresByMediaType('movie') instead */
export async function getGenres(): Promise<{ id: number; name: string }[]> {
  return getGenresByMediaType('movie')
}

// ── Discover ──────────────────────────────────────────────────────────────────

/**
 * Call TMDB /discover/movie or /discover/tv with the provided params.
 * This is the primary path when no text query is present.
 */
export async function discoverMedia(
  params: DiscoverParams
): Promise<TMDBResponse<Movie>> {
  const { mediaType, year, ...rest } = params
  const endpoint =
    mediaType === 'tv' ? '/discover/tv' : '/discover/movie'

  // TMDB uses different year params per media type
  const yearParam =
    mediaType === 'tv'
      ? { first_air_date_year: year || undefined }
      : { primary_release_year: year || undefined }

  const { data } = await tmdb.get<TMDBResponse<Movie>>(endpoint, {
    params: { ...rest, ...yearParam },
  })
  return data
}

// ── Search + multi-filter ─────────────────────────────────────────────────────

export async function searchMovies(
  query: string,
  page: number = 1,
  filters?: {
    mediaType?: MediaType
    genreId?: string
    year?: string
    sort?: SortOption | string
    rating?: string
  }
): Promise<Movie[]> {
  const mediaType: MediaType = filters?.mediaType ?? 'movie'

  // ── TEXT QUERY PATH ──────────────────────────────────────────────────────
  if (query.trim()) {
    // Route to media-type-specific endpoint when possible for better accuracy
    const searchEndpoint =
      mediaType === 'tv'
        ? '/search/tv'
        : mediaType === 'movie'
        ? '/search/movie'
        : '/search/multi'

    const { data } = await tmdb.get<TMDBResponse<Movie>>(searchEndpoint, {
      params: { query, page, include_adult: false },
    })

    let results = data.results

    // Client-side filter application (TMDB search endpoints don't support
    // discover params like with_genres, vote_average.gte)
    if (filters?.rating) {
      const minRating = parseFloat(filters.rating.replace('+', ''))
      results = results.filter((m) => m.vote_average >= minRating)
    }

    if (filters?.year) {
      results = results.filter((m) => {
        const d = m.release_date || m.first_air_date || ''
        return d ? new Date(d).getFullYear().toString() === filters.year : false
      })
    }

    if (filters?.genreId) {
      results = results.filter((m) =>
        m.genre_ids?.includes(Number(filters.genreId))
      )
    }

    if (filters?.sort) {
      results = [...results].sort((a, b) => {
        switch (filters.sort) {
          case 'vote_average.desc':
            return b.vote_average - a.vote_average
          case 'vote_average.asc':
            return a.vote_average - b.vote_average
          case 'release_date.desc':
            return (
              new Date(b.release_date || b.first_air_date || '').getTime() -
              new Date(a.release_date || a.first_air_date || '').getTime()
            )
          case 'release_date.asc':
            return (
              new Date(a.release_date || a.first_air_date || '').getTime() -
              new Date(b.release_date || b.first_air_date || '').getTime()
            )
          case 'popularity.asc':
            return a.popularity - b.popularity
          case 'popularity.desc':
          default:
            return b.popularity - a.popularity
        }
      })
    }

    return results
  }

  // ── DISCOVER PATH (no query) ─────────────────────────────────────────────
  const minRating = filters?.rating
    ? parseFloat(filters.rating.replace('+', ''))
    : undefined

  const discoverResponse = await discoverMedia({
    mediaType,
    sort_by: (filters?.sort as SortOption) ?? 'popularity.desc',
    with_genres: filters?.genreId || undefined,
    year: filters?.year || undefined,
    'vote_average.gte': minRating,
    page,
  })

  return discoverResponse.results
}

// ── Detail ────────────────────────────────────────────────────────────────────

export async function getMovieDetail(
  id: number,
  mediaType: MediaType = 'movie'
): Promise<MovieDetail> {
  const { data } = await tmdb.get<MovieDetail>(`/${mediaType}/${id}`, {
    params: { append_to_response: 'credits,videos' },
  })
  return data
}

// ── Genre-based collection ────────────────────────────────────────────────────

export async function getMoviesByGenre(
  genreId: number,
  page: number = 1
): Promise<TMDBResponse<Movie>> {
  const { data } = await tmdb.get<TMDBResponse<Movie>>('/discover/movie', {
    params: {
      with_genres: genreId,
      sort_by: 'popularity.desc',
      page,
    },
  })
  return data
}