import { User } from '../../../app/core/models/user.model';

export interface UsersState {
  currentUser: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  items: any[];
}