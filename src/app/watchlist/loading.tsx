export default function WatchlistLoading() {
  return (
    <main className="min-h-screen bg-[#0e0e0f] px-8 py-16 md:px-12 lg:px-24">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 space-y-3">
          <div className="h-16 w-64 animate-pulse rounded bg-[#201f21]" />
          <div className="h-4 w-32 animate-pulse rounded bg-[#131314]" />
        </div>
        <div className="mb-10 flex gap-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-8 w-20 animate-pulse rounded bg-[#131314]" />
          ))}
        </div>
        <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="aspect-[2/3] animate-pulse rounded bg-[#201f21]" />
          ))}
        </div>
      </div>
    </main>
  )
}