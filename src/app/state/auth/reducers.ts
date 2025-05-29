import { createReducer, on } from "@ngrx/store"
import type { User } from "../../core/models/user.model"
import * as AuthActions from "./actions"

export interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  loading: boolean
  error: string | null
}

export const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  loading: false,
  error: null,
}

export const authReducer = createReducer(
  initialState,

  // Login
  on(AuthActions.login, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(AuthActions.loginSuccess, (state, { token, user }) => ({
    ...state,
    user,
    token,
    isAuthenticated: true,
    loading: false,
    error: null,
  })),

  on(AuthActions.loginFailure, (state, { error }) => ({
    ...state,
    user: null,
    token: null,
    isAuthenticated: false,
    loading: false,
    error,
  })),

  // Logout
  on(AuthActions.logout, () => initialState),

  // Load Current User
  on(AuthActions.loadCurrentUser, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(AuthActions.loadCurrentUserSuccess, (state, { user }) => ({
    ...state,
    user,
    isAuthenticated: true,
    loading: false,
    error: null,
  })),

  on(AuthActions.loadCurrentUserFailure, (state, { error }) => ({
    ...state,
    user: null,
    isAuthenticated: false,
    loading: false,
    error,
  })),

  // Set Loading
  on(AuthActions.setAuthLoading, (state, { loading }) => ({
    ...state,
    loading,
  })),
)
