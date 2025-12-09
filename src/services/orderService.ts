import axiosInstance from '../config/axios';
import type { Order, CreateOrderDto } from '../types/order';

export const orderService = {
  getOrders: async (): Promise<Order[]> => {
    const response = await axiosInstance.get<Order[]>('/orders');
    return response.data;
  },

  getUserOrders: async (userId: string): Promise<Order[]> => {
    const response = await axiosInstance.get<Order[]>(`/orders/user/${userId}`);
    return response.data;
  },

  createOrder: async (orderDto: CreateOrderDto): Promise<Order> => {
    const response = await axiosInstance.post<Order>('/orders', orderDto);
    return response.data;
  },

  cancelOrder: async (orderId: string): Promise<void> => {
    await axiosInstance.patch(`/orders/${orderId}/cancel`);
  },

  completeOrder: async (orderId: string): Promise<void> => {
    await axiosInstance.patch(`/orders/${orderId}/complete`);
  },

  closeOrder: async (orderId: string): Promise<void> => {
    await axiosInstance.patch(`/orders/${orderId}/close`);
  },
};
