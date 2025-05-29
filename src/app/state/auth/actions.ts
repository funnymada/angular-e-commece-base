import { createAction, props } from "@ngrx/store"
import { User } from "../../core/models/user.model"

// Login
export const login = createAction("[Auth] Login", props<{ credentials: { username: string; password: string } }>())

export const loginSuccess = createAction("[Auth] Login Success", props<{ token: string; user: User }>())

export const loginFailure = createAction("[Auth] Login Failure", props<{ error: string }>())

// Logout
export const logout = createAction("[Auth] Logout")

// Load Current User
export const loadCurrentUser = createAction("[Auth] Load Current User")

export const loadCurrentUserSuccess = createAction("[Auth] Load Current User Success", props<{ user: User }>())

export const loadCurrentUserFailure = createAction("[Auth] Load Current User Failure", props<{ error: string }>())

// Check Auth Status
export const checkAuthStatus = createAction("[Auth] Check Auth Status")

// Set Loading
export const setAuthLoading = createAction("[Auth] Set Loading", props<{ loading: boolean }>())
