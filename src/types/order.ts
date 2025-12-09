export interface OrderItem {
  id: string;
  title: string;
  author: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: string;
  userId: string;
  userName: string;
  items: OrderItem[];
  total: number;
  date: string;
  status: string;
  paymentProviderId?: string;
  shippingAddress?: string;
}

export interface CreateOrderDto {
  userId: string;
  userName: string;
  items: OrderItem[];
  shippingAddress?: string;
}
