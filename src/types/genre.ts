export interface Genre {
  id: string;
  name: string;
  description: string;
  createdAt: string;
}

export interface CreateGenreDto {
  name: string;
  description: string;
}

export interface UpdateGenreDto {
  name: string;
  description: string;
}
