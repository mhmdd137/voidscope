# VOIDSCOPE — Progress

## Stack

- Next.js 15.3.1 + TypeScript
- Tailwind v4 (بدون config file)
- TanStack Query v5
- Zustand v5
- Axios
- بدون shadcn

## Done ✅

- Folder structure
- globals.css (Design System — VOIDSCOPE colors + glass utilities)
- layout.tsx (Inter font + Providers + Navbar)
- src/lib/utils.ts (cn)
- src/lib/tmdb.ts (API layer — getTrending, searchMovies, getMovieDetail, getMoviesByGenre, getGenres)
- src/lib/queryClient.ts
- src/types/movie.ts
- src/stores/watchlistStore.ts (Zustand + persist)
- src/components/layout/Providers.tsx
- src/components/layout/Navbar.tsx
- src/components/ui/MovieCard.tsx
- src/components/ui/MovieGrid.tsx
- src/hooks/useMovieSearch.ts
- src/hooks/useMovieDetail.ts
- src/hooks/useDebounce.ts
- src/hooks/useWatchlist.ts
- src/app/page.tsx (Home page — Hero + Trending grid) ✅

## Next 🔜

- Search page (src/app/search/page.tsx)
- Movie Detail page (src/app/movie/[id]/page.tsx)
- Watchlist page (src/app/watchlist/page.tsx)
- FilterBar component
- SearchBar component
- WatchlistBtn component
- loading.tsx و error.tsx لكل صفحة

## ملاحظات مهمة

- الملفات لازم تتعمل بـ New-Item من PowerShell أولاً قبل ما تحط الكود
- الـ .env.local فيه TMDB_API_KEY
- التصميم من Google Stitch — DESIGN.md موجود في الـ root
