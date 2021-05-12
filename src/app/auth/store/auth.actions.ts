import { FormGroup } from '@angular/forms';
import { createAction, props } from "@ngrx/store";


export const register = createAction(
  '[Auth] Register',

  props<{
    registerForm: FormGroup;
  }>()
);

export const logIn = createAction(
  '[Auth] LogIn',

  props<{
    username: string,
    password: string
  }>()

);

export const logInSuccess = createAction(
  '[Auth] LogInSuccess'
)

export const logInFailed = createAction(
  '[Auth] LogInFailed'
)

export const logOut = createAction(
  '[Auth] LogOut',

  props<{
    id: string
  }>()

)


