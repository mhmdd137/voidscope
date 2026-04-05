export default function SearchLoading() {
  return (
    <main className="min-h-screen bg-[#0e0e0f] px-6 py-10 md:px-12 lg:px-24">

      {/* SearchBar skeleton */}
      <div className="mb-8 h-14 animate-pulse rounded bg-[#131314]" />

      {/* FilterBar skeleton */}
      <div className="mb-10 flex gap-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-8 w-24 animate-pulse rounded bg-[#131314]" />
        ))}
      </div>

      {/* Grid skeleton */}
      <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="aspect-[2/3] animate-pulse rounded bg-[#201f21]" />
        ))}
      </div>

    </main>
  )
}