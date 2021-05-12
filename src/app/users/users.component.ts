import { DataUpdateService } from 'src/app/shared/data-update.service';
import { Subscription } from 'rxjs';
import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { User } from './user.model';
import * as fromApp from '../store/app.reducer';
import { Store } from '@ngrx/store';
import * as UsersActions from './store/users.actions'

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit ,OnDestroy{
  users: User[] = [];
  @Input() admin: User = null;
  state: Subscription = new Subscription;

  constructor(private store: Store<fromApp.AppState>, private dataUpdateService: DataUpdateService) { }

  ngOnInit(): void {
    this.store.dispatch(
      UsersActions.initUsersStart()
    )

    this.store.select('users').subscribe(state=>{

      this.users = state.users;
      }
    );

    this.dataUpdateService.dataUpdate("users");
  }

  ngOnDestroy(){
    this.state.unsubscribe();
  }



}
