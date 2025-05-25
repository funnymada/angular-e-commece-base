import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Product } from '../../../app/core/models/product.model';

export const ProductsActions = createActionGroup({
  source: 'Products',
  events: {
    'Load Products': emptyProps(),
    'Load Products Success': props<{ items: Product[] }>(),
    'Load Products Failure': props<{ error: string }>(),
  }
});