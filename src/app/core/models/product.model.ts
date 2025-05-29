export interface Product {
  id: string // Changed from number to string for MongoDB ObjectId
  name: string
  description: string
  price: number
  categoryId: number
  stock: number
  imageUrl?: string
  createdAt: string
  updatedAt: string
  category?: {
    id: number
    name: string
  }
}

export interface ProductCreate {
  name: string
  description: string
  price: number
  categoryId: number
  stock: number
  imageUrl?: string
}

export interface ProductUpdate {
  name?: string
  description?: string
  price?: number
  categoryId?: number
  stock?: number
  imageUrl?: string
}
