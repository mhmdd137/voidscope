export interface Movie {
  id: number;
  title: string;
  name?: string; // للـ TV shows
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  vote_average: number;
  vote_count: number;
  release_date: string;
  first_air_date?: string; // للـ TV shows
  genre_ids: number[];
  media_type?: "movie" | "tv";
  popularity: number;
  adult: boolean;
}

export interface MovieDetail extends Movie {
  genres: Genre[];
  runtime: number | null;
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

export interface SearchFilters {
  query: string;
  genre?: number;
  year?: number;
  sortBy?: "popularity.desc" | "vote_average.desc" | "release_date.desc";
  mediaType?: "movie" | "tv" | "all";
}