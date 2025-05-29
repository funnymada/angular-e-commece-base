export type OrderStatus = "pending" | "completed" | "cancelled"

export interface User {
  id: string | number // Allow both types during transition
  username: string
  email: string
}

export interface OrderItem {
  id: string | number // Allow both types during transition
  productId: string | number // Allow both types during transition
  quantity: number
  price: number
  product?: {
    id: string | number
    name: string
    imageUrl?: string
  }
}

export interface Order {
  id: string | number // Allow both types during transition
  orderNumber: string
  user?: User
  userId?: string | number // Allow both types during transition
  items: OrderItem[]
  totalAmount: number
  status: OrderStatus
  shippingAddress?: string
  billingAddress?: string
  paymentMethod?: string
  notes?: string
  createdAt: string
  updatedAt: string
}

export interface OrderCreate {
  userId: string | number
  items: {
    productId: string | number
    quantity: number
    price: number
  }[]
  totalAmount: number
  shippingAddress?: string
  billingAddress?: string
  paymentMethod?: string
  notes?: string
}

export interface OrderUpdate {
  status?: OrderStatus
  shippingAddress?: string
  billingAddress?: string
  paymentMethod?: string
  notes?: string
}
