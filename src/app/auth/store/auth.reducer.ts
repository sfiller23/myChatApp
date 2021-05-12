import { Action, createReducer, on } from "@ngrx/store";
import * as AuthActions from './auth.actions';
import { FormGroup, FormControl } from '@angular/forms';




export interface State{
  registerForm: FormGroup;
}

const initialState: State = {
  registerForm: new FormGroup({username: new FormControl(''),
                              email: new FormControl(''),
                              password1: new FormControl(''),
                              password2: new FormControl(''),

                            }),


}

const _authReducer = createReducer(

  initialState,


  on(
    AuthActions.register,
    (state, action) => (

      {
      ...state,
      registerForm: action.registerForm,
    })
  ),


)

export function authReducer(state: State = initialState, action:Action) {
  return _authReducer(state, action);
};

