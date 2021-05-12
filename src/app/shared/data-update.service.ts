import { environment } from './../../environments/environment.prod';
import { Store } from '@ngrx/store';
import { GeneralService } from 'src/app/shared/general.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { interval } from 'rxjs';
import * as fromApp from '../store/app.reducer';
import * as UsersActions from '../users/store/users.actions';
import * as ChatActions from '../chat/store/chat.actions';

@Injectable({
  providedIn: 'root'
})
export class DataUpdateService {

  constructor(private http: HttpClient, private generalService: GeneralService, private store: Store<fromApp.AppState>) { }

  dataUpdate(componentName: string): void{
    interval(3000).subscribe(
      ()=>{
        this.http.get(environment.APIaccessPoint+componentName+'.json').subscribe(
          res=>{

            const data = this.generalService.apiObjectToArray(res);
            switch(componentName) {
              case "users": {

                this.store.dispatch(
                  UsersActions.updateUsers({users: data})
                )
                 break;
              }
              case "chatBoxes": {
                this.store.dispatch(
                  ChatActions.initChat()
                )
                 break;
              }
              default: {

                 break;
              }
           }


          }
        )
      }
    );
  }
}
