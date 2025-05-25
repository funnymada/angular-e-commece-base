import { Product } from "./product.model";

export interface Order {
    id: number;
    orderNumber: string;
    userId: number;
    totalAmount: number;
    status: 'pending' | 'shipped' | 'delivered' | 'canceled';
    createdAt: string;
    updatedAt: string;
    orderItems?: OrderItem[];
  }

  export interface OrderItem {
    id: number;
    orderId: number;
    productId: number;
    quantity: number;
    price: number;
    product?: Product;
  }