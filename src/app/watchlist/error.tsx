'use client'

export default function WatchlistError({ reset }: { reset: () => void }) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-[#0e0e0f] text-center">
      <p className="text-xs uppercase tracking-[0.1em] text-[#8ff5ff]">
        Signal Lost
      </p>
      <p className="mt-2 text-sm text-[#484849]">
        Something went wrong
      </p>
      <button
        onClick={reset}
        className="mt-8 rounded border border-[#484849]/15 bg-[#131314] px-6 py-2.5 text-xs uppercase tracking-[0.08em] text-white transition-all hover:border-[#8ff5ff]/30 hover:text-[#8ff5ff]"
      >
        Retry
      </button>
    </main>
  )
}