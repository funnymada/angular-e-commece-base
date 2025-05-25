import { Category } from '../../core/models/category.model';

export interface CategoriesState {
  items: Category[];
  loading: boolean;
  error: string | null;
}