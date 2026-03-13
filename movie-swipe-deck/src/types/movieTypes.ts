export interface Cast {
  id: string;
  movie_id: number;
  name: string;
  original_name: string;
  popularity: string
  profile_path: string | null;
  character: string;
  created_at: string | null;
  updated_at: string | null;
}

export interface Movie {
  id: string;
  movie_id: number;
  original_title: string;
  original_language: string;
  overview: string;
  popularity: number;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  vote_count: number;
  adult: 0 | 1;
  created_at: string | null;
  updated_at: string | null;
  casts: Cast[];
}

export type MoviesApiResponse = Movie[];

export interface ApiError {
  message: string;
  status?: number;
}