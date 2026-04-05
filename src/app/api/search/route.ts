import { NextRequest, NextResponse } from 'next/server'
import { searchMovies } from '@/lib/tmdb'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get('q') ?? ''
  const page = Number(searchParams.get('page') ?? '1')
  const genreId = searchParams.get('genre') ?? ''
  const year = searchParams.get('year') ?? ''
  const sort = searchParams.get('sort') ?? 'popularity.desc'
  const rating = searchParams.get('rating') ?? ''

  try {
    const results = await searchMovies(query, page, { genreId, year, sort, rating })
    return NextResponse.json(results)
  } catch {
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 })
  }
}