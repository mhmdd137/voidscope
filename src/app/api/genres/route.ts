import { NextRequest, NextResponse } from 'next/server'
import { getGenresByMediaType } from '@/lib/tmdb'
import type { MediaType } from '@/types/movie'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const raw = searchParams.get('mediaType') ?? 'movie'
  const mediaType: MediaType = raw === 'tv' ? 'tv' : 'movie'

  try {
    const genres = await getGenresByMediaType(mediaType)
    return NextResponse.json(genres, {
      headers: {
        // Cache for 24 h — genres rarely change
        'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=3600',
      },
    })
  } catch {
    return NextResponse.json(
      { error: 'Failed to fetch genres' },
      { status: 500 }
    )
  }
}
