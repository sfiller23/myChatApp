
import { Action, createReducer, on} from "@ngrx/store";
import * as UsersActions from './users.actions';
import { User } from '../user.model';


export interface State{
  users: User[];

}

const initialState: State = {
  users: [],

}

const _usersReducer = createReducer(

  initialState,


  on(
    UsersActions.initUsers,
    (state, action) => (

      {
      ...state,
      users: [...action.users]
    })
  ),

  on(
    UsersActions.updateUsers,
    (state, action) => (

      {
      ...state,
      users: [...action.users]
    })
  ),


)

export function usersReducer(state: State = initialState, action:Action) {
  return _usersReducer(state, action);
};

