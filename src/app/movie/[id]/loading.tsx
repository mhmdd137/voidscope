export default function MovieLoading() {
  return (
    <div className="relative min-h-screen bg-[#0e0e0f] px-8 pt-24">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 h-4 w-24 animate-pulse rounded bg-[#131314]" />
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-[1fr_340px]">
          <div className="space-y-8">
            <div className="h-6 w-32 animate-pulse rounded bg-[#131314]" />
            <div className="h-24 w-3/4 animate-pulse rounded bg-[#201f21]" />
            <div className="h-16 w-48 animate-pulse rounded bg-[#131314]" />
            <div className="h-48 animate-pulse rounded bg-[#131314]" />
          </div>
          <div className="space-y-6">
            <div className="aspect-[2/3] animate-pulse rounded bg-[#201f21]" />
            <div className="h-40 animate-pulse rounded bg-[#131314]" />
          </div>
        </div>
      </div>
    </div>
  )
}