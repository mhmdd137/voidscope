import { NextRequest, NextResponse } from 'next/server'
import { searchMovies } from '@/lib/tmdb'
import type { MediaType, SortOption } from '@/types/movie'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get('q') ?? ''
  const page = Number(searchParams.get('page') ?? '1')
  const genreId = searchParams.get('genre') ?? ''
  const year = searchParams.get('year') ?? ''
  const sort = (searchParams.get('sort') ?? 'popularity.desc') as SortOption
  const rating = searchParams.get('rating') ?? ''
  const raw = searchParams.get('mediaType') ?? 'movie'
  const mediaType: MediaType = raw === 'tv' ? 'tv' : 'movie'

  try {
    const results = await searchMovies(query, page, {
      mediaType,
      genreId,
      year,
      sort,
      rating,
    })
    return NextResponse.json(results)
  } catch {
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 })
  }
}