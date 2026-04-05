import axios from 'axios'
import type { Movie, MovieDetail, TMDBResponse } from '@/types/movie'

const tmdb = axios.create({
  baseURL: process.env.TMDB_BASE_URL,
  params: {
    api_key: process.env.TMDB_API_KEY,
    language: 'en-US',
  },
})

export const IMAGE_URL = process.env.NEXT_PUBLIC_TMDB_IMAGE_URL

export function getImageUrl(
  path: string | null,
  size: 'w92' | 'w300' | 'w500' | 'w780' | 'original' = 'w500'
): string {
  if (!path) return '/placeholder.jpg'
  return `${IMAGE_URL}/${size}${path}`
}

export async function getTrending(): Promise<Movie[]> {
  const { data } = await tmdb.get<TMDBResponse<Movie>>('/trending/all/week')
  return data.results
}

export async function searchMovies(
  query: string,
  page: number = 1,
  filters?: {
    genreId?: string
    year?: string
    sort?: string
    rating?: string
  }
): Promise<Movie[]> {
  if (query) {
    const { data } = await tmdb.get<TMDBResponse<Movie>>('/search/multi', {
      params: { query, page, include_adult: false },
    })

    let results = data.results

    if (filters?.rating) {
      const minRating = parseFloat(filters.rating.replace('+', ''))
      results = results.filter((m) => m.vote_average >= minRating)
    }

    if (filters?.year) {
      results = results.filter((m) => {
        const releaseYear = m.release_date
          ? new Date(m.release_date).getFullYear().toString()
          : m.first_air_date
          ? new Date(m.first_air_date).getFullYear().toString()
          : ''
        return releaseYear === filters.year
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
          case 'release_date.desc':
            return new Date(b.release_date || b.first_air_date || '').getTime() -
                   new Date(a.release_date || a.first_air_date || '').getTime()
          case 'release_date.asc':
            return new Date(a.release_date || a.first_air_date || '').getTime() -
                   new Date(b.release_date || b.first_air_date || '').getTime()
          case 'popularity.desc':
          default:
            return b.popularity - a.popularity
        }
      })
    }

    return results
  }

  const minRating = filters?.rating
    ? parseFloat(filters.rating.replace('+', ''))
    : undefined

  const { data } = await tmdb.get<TMDBResponse<Movie>>('/discover/movie', {
    params: {
      sort_by: filters?.sort ?? 'popularity.desc',
      with_genres: filters?.genreId || undefined,
      primary_release_year: filters?.year || undefined,
      'vote_average.gte': minRating,
      page,
    },
  })
  return data.results
}

export async function getMovieDetail(
  id: number,
  mediaType: 'movie' | 'tv' = 'movie'
): Promise<MovieDetail> {
  const { data } = await tmdb.get<MovieDetail>(`/${mediaType}/${id}`, {
    params: { append_to_response: 'credits,videos' },
  })
  return data
}

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

export async function getGenres(): Promise<{ id: number; name: string }[]> {
  const { data } = await tmdb.get<{ genres: { id: number; name: string }[] }>(
    '/genre/movie/list'
  )
  return data.genres
}