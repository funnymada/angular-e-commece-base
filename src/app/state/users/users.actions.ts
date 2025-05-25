import { createActionGroup, props, emptyProps } from '@ngrx/store';
import { User, LoginRequest } from '../../../app/core/models/user.model';

export const UsersActions = createActionGroup({
  source: 'Users',
  events: {
    'Login': props<{ credentials: LoginRequest }>(),
    'Login Success': props<{ user: User, token: string }>(),
    'Login Failure': props<{ error: string }>(),

    'Get Current User': emptyProps(),
    'Get Current User Success': props<{ user: User }>(),
    'Get Current User Failure': props<{ error: string }>(),

    'Logout': emptyProps()
  }
});