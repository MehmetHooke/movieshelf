
export type TmdbPagedResponse<T> = {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
};


export type TmdbMovie = {
  id: number;
  title: string;
  overview?: string;
  release_date?: string;
  poster_path?: string | null;
  backdrop_path?: string | null;
  vote_average?: number;
  runtime?: number;
  genres?: { id: number; name: string }[];
};

export type TmdbCastMember = {
  id: number;
  name: string;
  character?: string;
  profile_path?: string | null;
};

export type TmdbCreditsResponse = {
  id: number;
  cast: TmdbCastMember[];
};


export type Genre = { id: number; name: string };

export type TmdbGenreListResponse = {
  genres: Genre[];
};