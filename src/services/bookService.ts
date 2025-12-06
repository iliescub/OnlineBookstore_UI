import axiosInstance from '../config/axios';
import type { Book } from '../types/book';

export const bookService = {
  getBooks: async (category?: string): Promise<Book[]> => {
    const url = category ? `/books?category=${encodeURIComponent(category)}` : '/books';
    const response = await axiosInstance.get<Book[]>(url);
    return response.data;
  },

  getBook: async (id: string): Promise<Book> => {
    const response = await axiosInstance.get<Book>(`/books/${id}`);
    return response.data;
  },

  createBook: async (book: Book): Promise<Book> => {
    const response = await axiosInstance.post<Book>('/books', book);
    return response.data;
  },

  updateBook: async (id: string, book: Book): Promise<Book> => {
    const response = await axiosInstance.put<Book>(`/books/${id}`, book);
    return response.data;
  },

  deleteBook: async (id: string): Promise<void> => {
    await axiosInstance.delete(`/books/${id}`);
  },
};
