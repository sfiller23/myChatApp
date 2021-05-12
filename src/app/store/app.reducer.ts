
import { ActionReducerMap } from '@ngrx/store';
import * as fromAuth from '../auth/store/auth.reducer';
import * as fromChat from '../chat/store/chat.reducer';
import * as fromUsers from '../users/store/users.reducer';


export interface AppState{
  auth: fromAuth.State;
  users: fromUsers.State;
  chat: fromChat.State;

}

export const appReducer: ActionReducerMap<AppState> = {
  auth: fromAuth.authReducer,
  users: fromUsers.usersReducer,
  chat: fromChat.chatReducer,

};
