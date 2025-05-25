import { Category } from "./category.model";

export interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    categoryId: number;
    stock: number;
    imageUrl?: string;
    createdAt: string;
    updatedAt: string;
    category?: Category;
  }