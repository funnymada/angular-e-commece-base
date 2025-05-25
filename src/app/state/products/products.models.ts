import { Product } from '../../../app/core/models/product.model';

export interface ProductsState {
  items: Product[];
  loading: boolean;
  error: string | null;
}