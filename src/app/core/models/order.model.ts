export interface Order {
  id: number
  orderNumber: string
  userId: number
  totalAmount: number
  status: OrderStatus
  createdAt: string
  updatedAt: string
  user?: {
    id: number
    username: string
    email: string
  }
  items?: OrderItem[]
}

export interface OrderItem {
  id: number
  orderId: number
  productId: number
  quantity: number
  price: number
  product?: {
    id: number
    name: string
    imageUrl?: string
  }
}

export type OrderStatus = "pending" | "shipped" | "delivered" | "canceled"

export interface OrderStatusUpdate {
  status: OrderStatus
}

