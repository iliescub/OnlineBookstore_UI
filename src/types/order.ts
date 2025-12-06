export interface OrderItem {
  id: string;
  title: string;
  author: string;
  price: number;
  quantity: number;
}

export interface PaymentInfo {
  cardNumber: string;
  cardName: string;
  expiry: string;
  cvv: string;
  address: string;
}

export interface Order {
  id: string;
  userId: string;
  userName: string;
  items: OrderItem[];
  total: number;
  date: string;
  status: string;
  paymentInfo?: PaymentInfo;
}

export interface CreateOrderDto {
  userId: string;
  userName: string;
  items: OrderItem[];
  paymentInfo?: PaymentInfo;
}
