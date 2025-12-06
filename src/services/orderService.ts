import axiosInstance from '../config/axios';
import type { Order, CreateOrderDto } from '../types/order';

export const orderService = {
  getOrders: async (): Promise<Order[]> => {
    const response = await axiosInstance.get<Order[]>('/orders');
    return response.data;
  },

  createOrder: async (orderDto: CreateOrderDto): Promise<Order> => {
    const response = await axiosInstance.post<Order>('/orders', orderDto);
    return response.data;
  },
};
