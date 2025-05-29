export interface Category {
  id: string | number 
  name: string
  description: string
  createdAt: string
  updatedAt: string
}

export interface CategoryCreate {
  name: string
  description: string
}

export interface CategoryUpdate {
  name?: string
  description?: string
}
