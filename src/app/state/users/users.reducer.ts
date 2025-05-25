import { createReducer, on } from '@ngrx/store';
import { UsersActions } from './users.actions';
import { UsersState } from './users.models';

export const initialState: UsersState = {
  currentUser: null,
  token: null,
  loading: false,
  error: null,
    items: []
};

export const usersReducer = createReducer(
  initialState,

  // 🔐 LOGIN
  on(UsersActions.login, state => ({
    ...state,
    loading: true,
    error: null
  })),

  on(UsersActions.loginSuccess, (state, { user, token }) => ({
    ...state,
    loading: false,
    currentUser: user,
    token,
    error: null
  })),

  on(UsersActions.loginFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  // 👤 CURRENT USER
  on(UsersActions.getCurrentUser, state => ({
    ...state,
    loading: true
  })),

  on(UsersActions.getCurrentUserSuccess, (state, { user }) => ({
    ...state,
    loading: false,
    currentUser: user
  })),

  on(UsersActions.getCurrentUserFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  // 🚪 LOGOUT
  on(UsersActions.logout, state => ({
    ...state,
    currentUser: null,
    token: null,
    loading: false,
    error: null
  }))
);
