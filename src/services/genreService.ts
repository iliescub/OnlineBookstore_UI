import axiosInstance from '../config/axios';
import type { Genre, CreateGenreDto, UpdateGenreDto } from '../types/genre';

export const genreService = {
  getGenres: async (): Promise<Genre[]> => {
    const response = await axiosInstance.get<Genre[]>('/genres');
    return response.data;
  },

  getGenre: async (id: string): Promise<Genre> => {
    const response = await axiosInstance.get<Genre>(`/genres/${id}`);
    return response.data;
  },

  createGenre: async (genre: CreateGenreDto): Promise<Genre> => {
    const response = await axiosInstance.post<Genre>('/genres', genre);
    return response.data;
  },

  updateGenre: async (id: string, genre: UpdateGenreDto): Promise<Genre> => {
    const response = await axiosInstance.put<Genre>(`/genres/${id}`, genre);
    return response.data;
  },

  deleteGenre: async (id: string): Promise<void> => {
    await axiosInstance.delete(`/genres/${id}`);
  },
};
