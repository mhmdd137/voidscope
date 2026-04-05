import { getMovieDetail } from '@/lib/tmdb'
import { getImageUrl } from '@/lib/tmdb'
import WatchlistBtn from '@/components/ui/WatchlistBtn'
import Link from 'next/link'
import { notFound } from 'next/navigation'

interface MoviePageProps {
  params: { id: string }
}

export default async function MoviePage({ params }: MoviePageProps) {
  const movie = await getMovieDetail(Number(params.id))

  if (!movie) notFound()

  const backdrop = getImageUrl(movie.backdrop_path, 'original')
  const poster = getImageUrl(movie.poster_path, 'w500')

  const runtime = movie.runtime
    ? `${Math.floor(movie.runtime / 60)}H ${movie.runtime % 60}M`
    : null

  const year = movie.release_date
    ? new Date(movie.release_date).getFullYear()
    : null

  const genres = movie.genres?.map((g: { name: string }) => g.name).join(' / ')

  const cast = movie.credits?.cast?.slice(0, 3) ?? []

  return (
    <div className="relative min-h-screen bg-[#0e0e0f]">

      {/* Backdrop */}
      <div className="absolute inset-0 z-0 h-[100vh]">
        <img
          src={backdrop}
          alt=""
          aria-hidden="true"
          className="h-full w-full object-cover opacity-25"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0e0e0f] via-[#0e0e0f]/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0e0e0f]/90 via-[#0e0e0f]/40 to-transparent" />
      </div>

      {/* Content */}
      <main className="relative z-10 mx-auto max-w-7xl px-8 pt-24 pb-32">

        {/* Back */}
        <Link
          href="/search"
          className="mb-12 inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.15em] text-[#484849] transition-colors hover:text-white"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
            <path d="M19 12H5M12 5l-7 7 7 7" />
          </svg>
          Back to Scan
        </Link>

        <div className="grid grid-cols-1 gap-16 lg:grid-cols-[1fr_340px]">

          {/* Left column */}
          <div className="space-y-10">

            {/* Meta label */}
            <div className="flex items-center gap-4">
              <span className="rounded-sm border border-[#484849]/15 bg-[#201f21]/40 px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-[#8ff5ff] backdrop-blur-md">
                {movie.media_type === 'tv' ? 'Series' : 'Original Feature'}
              </span>
              <span className="text-[10px] uppercase tracking-[0.1em] text-[#484849]">
                {[runtime, year].filter(Boolean).join(' • ')}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-6xl font-black leading-none tracking-tighter text-white md:text-8xl">
              {(movie.title || movie.name || '').toUpperCase()}
            </h1>

            {/* Scores row */}
            <div className="flex items-center gap-8">
              <div>
                <p className="mb-1 text-[10px] uppercase tracking-[0.15em] text-[#484849]">
                  Critical Score
                </p>
                <div className="flex items-center gap-2">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="#8ff5ff" aria-hidden="true">
                    <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
                  </svg>
                  <span className="text-3xl font-bold text-white">
                    {movie.vote_average.toFixed(1)}
                  </span>
                </div>
              </div>

              {genres && (
                <div className="border-l border-[#484849]/15 pl-8">
                  <p className="mb-1 text-[10px] uppercase tracking-[0.15em] text-[#484849]">
                    Genre
                  </p>
                  <p className="text-base text-white">{genres}</p>
                </div>
              )}
            </div>

            {/* Overview glass card */}
            <div className="rounded border border-[#484849]/15 bg-[#201f21]/60 p-8 backdrop-blur-md">
              <p className="text-lg font-light leading-relaxed text-[#ffffff]/80">
                {movie.overview}
              </p>

              <div className="mt-8 flex flex-wrap gap-4">
                
                  <a href="#"
                  className="rounded-sm bg-[#8ff5ff] px-10 py-3 text-sm font-bold uppercase tracking-[0.05em] text-[#0e0e0f] transition-all hover:shadow-[0_0_20px_rgba(143,245,255,0.3)] active:scale-95"
                >
                  Watch Now
                </a>
                <WatchlistBtn movie={movie} />
              </div>
            </div>

          </div>

          {/* Right column */}
          <div className="space-y-8">

            {/* Poster */}
            <div className="overflow-hidden rounded border border-[#484849]/15">
              <img
                src={poster}
                alt={movie.title || movie.name || ''}
                className="w-full object-cover"
              />
            </div>

            {/* Cast */}
            {cast.length > 0 && (
              <div>
                <p className="mb-4 text-[10px] uppercase tracking-[0.15em] text-[#484849]">
                  Featured Cast
                </p>
                <div className="space-y-3">
                  {cast.map((actor: { id: number; name: string; character: string; profile_path: string | null }) => (
                    <div
                      key={actor.id}
                      className="flex items-center gap-4 rounded border border-[#484849]/10 bg-[#131314]/60 px-4 py-3 backdrop-blur-sm"
                    >
                      <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded-sm bg-[#201f21]">
                        {actor.profile_path ? (
                          <img
                            src={getImageUrl(actor.profile_path, 'w92')}
                            alt={actor.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-xs text-[#484849]">
                            {actor.name.charAt(0)}
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">{actor.name}</p>
                        <p className="text-[10px] uppercase tracking-[0.1em] text-[#484849]">
                          {actor.character}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Technical specs */}
            <div className="rounded border border-[#484849]/15 bg-[#131314]/60 p-5 backdrop-blur-sm">
              <p className="mb-4 text-[10px] uppercase tracking-[0.15em] text-[#484849]">
                Transmission Data
              </p>
              <div className="space-y-3">
                {movie.spoken_languages?.[0] && (
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase tracking-[0.1em] text-[#484849]">Language</span>
                    <span className="text-xs uppercase tracking-[0.05em] text-white">
                      {movie.spoken_languages[0].english_name}
                    </span>
                  </div>
                )}
                {movie.status && (
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase tracking-[0.1em] text-[#484849]">Status</span>
                    <span className="text-xs uppercase tracking-[0.05em] text-[#8ff5ff]">
                      {movie.status}
                    </span>
                  </div>
                )}
                {movie.budget > 0 && (
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase tracking-[0.1em] text-[#484849]">Budget</span>
                    <span className="text-xs uppercase tracking-[0.05em] text-white">
                      ${(movie.budget / 1_000_000).toFixed(0)}M
                    </span>
                  </div>
                )}
                {movie.revenue > 0 && (
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase tracking-[0.1em] text-[#484849]">Revenue</span>
                    <span className="text-xs uppercase tracking-[0.05em] text-white">
                      ${(movie.revenue / 1_000_000).toFixed(0)}M
                    </span>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  )
}