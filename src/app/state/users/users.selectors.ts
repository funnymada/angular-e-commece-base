import { createFeatureSelector, createSelector } from '@ngrx/store';
import { UsersState } from './users.models';

export const selectUsersState = createFeatureSelector<UsersState>('users');

export const selectAllUsers = createSelector(
  selectUsersState,
  state => state.items
);

export const selectUsersLoading = createSelector(
  selectUsersState,
  state => state.loading
);