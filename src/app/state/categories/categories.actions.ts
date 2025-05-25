import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Category } from '../../../app/core/models/category.model';

export const CategoriesActions = createActionGroup({
  source: 'Categories',
  events: {
    'Load Categories': emptyProps(),
    'Load Categories Success': props<{ items: Category[] }>(),
    'Load Categories Failure': props<{ error: string }>(),
  }
});