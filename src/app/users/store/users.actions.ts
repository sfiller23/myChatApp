import { User } from 'src/app/users/user.model';
import { createAction, props } from "@ngrx/store";


export const initUsersStart = createAction(
  '[Users] InitUsersStart'
);

export const initUsers = createAction(
  '[Users] InitUsers',

  props<{
    users: User[];
  }>()
);

export const addUser = createAction(
  '[Users] AddUser',

  props<{
    user: User;
  }>()
);

export const updateUserState = createAction(
  '[Users] UpdateUserState',

  props<{
    user: User;
    logedin: boolean;
  }>()
);

export const updateUsers = createAction(
  '[Users] UpdateUserState',

  props<{
    users: User[];
  }>()
);


