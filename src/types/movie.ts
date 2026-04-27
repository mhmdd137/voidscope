export interface Movie {
  id: number;
  title: string;
  name?: string; // TV shows
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  vote_average: number;
  vote_count: number;
  release_date: string;
  first_air_date?: string; // TV shows
  genre_ids: number[];
  media_type?: 'movie' | 'tv';
  popularity: number;
  adult: boolean;
}

export interface MovieDetail extends Movie {
  genres: Genre[];
  runtime: number | null;
  number_of_seasons?: number;
  number_of_episodes?: number;
  status: string;
  tagline: string;
  budget: number;
  revenue: number;
  production_companies: ProductionCompany[];
  spoken_languages: SpokenLanguage[];
  credits?: Credits;
  videos?: VideoResults;
}

export interface Genre {
  id: number;
  name: string;
}

export interface ProductionCompany {
  id: number;
  name: string;
  logo_path: string | null;
}

export interface SpokenLanguage {
  english_name: string;
  iso_639_1: string;
}

export interface Credits {
  cast: CastMember[];
  crew: CrewMember[];
}

export interface CastMember {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
  order: number;
}

export interface CrewMember {
  id: number;
  name: string;
  job: string;
  department: string;
  profile_path: string | null;
}

export interface VideoResults {
  results: Video[];
}

export interface Video {
  id: string;
  key: string;
  name: string;
  site: string;
  type: string;
  official: boolean;
}

export interface TMDBResponse<T> {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
}

// ── Filter system ─────────────────────────────────────────────────────────────

export type MediaType = 'movie' | 'tv';

export type SortOption =
  | 'popularity.desc'
  | 'popularity.asc'
  | 'vote_average.desc'
  | 'vote_average.asc'
  | 'release_date.desc'
  | 'release_date.asc';

export interface ActiveFilters {
  mediaType: MediaType;
  genreId: string;
  rating: string;
  year: string;
  sort: SortOption;
}

/** Params forwarded directly to TMDB /discover endpoint */
export interface DiscoverParams {
  mediaType: MediaType;
  sort_by?: SortOption;
  with_genres?: string;
  /** movie: primary_release_year  |  tv: first_air_date_year */
  year?: string;
  'vote_average.gte'?: number;
  page?: number;
}

/** Legacy alias kept for backwards compat */
export interface SearchFilters {
  query: string;
  mediaType: MediaType;
  genreId?: string;
  year?: string;
  rating?: string;
  sort?: SortOption;
}