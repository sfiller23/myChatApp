import { environment } from './../../../environments/environment.prod';
import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import {  map, switchMap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http'
import { GeneralService } from 'src/app/shared/general.service';
import * as UsersActions from '../../users/store/users.actions';
import { User } from '../user.model';


@Injectable()
export class UsersEffects {
  users: User[] = [];

  constructor(private action$: Actions, private http: HttpClient, private generalService: GeneralService){

  }


  initUsersStart$ = createEffect(() => this.action$.pipe(

    ofType(UsersActions.initUsersStart),
    switchMap((action) => {

      return this.http.get<any>(environment.APIaccessPoint+'/users.json').pipe(

        map((res)=>{

          this.users = this.generalService.apiObjectToArray(res);

          return UsersActions.initUsers({users: this.users});

      }),

      )
    }


    )));


}
