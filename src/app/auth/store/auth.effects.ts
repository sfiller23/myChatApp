import { environment } from './../../../environments/environment.prod';
import { Router } from '@angular/router';
import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import * as AuthActions from './auth.actions';
import { map, switchMap, tap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http'
import { GeneralService } from 'src/app/shared/general.service';
import { PsaudoUser } from '../auth.service';
import { User } from 'src/app/users/user.model';

@Injectable()
export class AuthEffects {
  users: User[] = [];
  user: User = new User('','','','', false);

  constructor(private action$: Actions, private http: HttpClient, private router: Router, private generalService: GeneralService){

  }


  authRegister$ = createEffect(() => this.action$.pipe(

    ofType(AuthActions.register),

    switchMap((action) => {

      const psaudoUser: PsaudoUser ={
        username: action.registerForm.value["username"],
        email: action.registerForm.value["email"],
        password: action.registerForm.value["password1"],
        isLogedin: true,
        isAdmin: true
      }

      return this.http.post<{name: string}>(environment.APIaccessPoint+'/users.json', psaudoUser).pipe(

        map(resData => {

          this.user = new User(resData.name, psaudoUser.username, psaudoUser.email, psaudoUser.password, true);

          return AuthActions.logIn({username: psaudoUser.username, password: psaudoUser.password})//change this to user create action

        }),
      )
    })
  ));

  authLogin$ = createEffect(() => this.action$.pipe(

    ofType(AuthActions.logIn),
    switchMap((action) => {

      const username = action.username;
      const password = action.password;

      return this.http.get<any>(environment.APIaccessPoint+'/users.json').pipe(

        map((res)=>{
          this.users = this.generalService.apiObjectToArray(res);

          const userExists: any = this.generalService.findUser(this.users, username, password);

          if(userExists.id){
            localStorage.setItem('userData', JSON.stringify(userExists));

            this.http.patch(environment.APIaccessPoint+'/users/'+ userExists.id +'.json',{isLogedin: true}).subscribe();

            return AuthActions.logInSuccess();

          }else{

            return AuthActions.logInFailed();

          }
      }),
      tap((res)=>{

        this.router.navigate(['/chat']);

      })

      )
    }


    )));

    authLogout$ = createEffect(() => this.action$.pipe(
      ofType(AuthActions.logOut),
      tap((action) => {

        this.http.patch(environment.APIaccessPoint+'/users/'+ action.id +'.json',{isLogedin: false}).subscribe(res=>{
          localStorage.removeItem('userData');
          this.router.navigate(['']);
        });

      }),

      ),
      { dispatch: false }
    )

}
