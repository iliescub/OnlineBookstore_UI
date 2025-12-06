import axiosInstance from '../config/axios';
import type { User } from '../types/user';

export const userService = {
  getUsers: async (): Promise<User[]> => {
    const response = await axiosInstance.get<User[]>('/users');
    return response.data;
  },

  deleteUser: async (id: string): Promise<void> => {
    await axiosInstance.delete(`/users/${id}`);
  },
};
