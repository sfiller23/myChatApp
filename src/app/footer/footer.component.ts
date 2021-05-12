import { User } from 'src/app/users/user.model';
import { Subscription } from 'rxjs';
import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromApp from '../store/app.reducer';
import * as AuthActions from '../auth/store/auth.actions';
import { UsersService } from '../users/users.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit , OnDestroy{
  @Input() admin: User = null;

  state: Subscription = new Subscription;

  constructor(private store: Store<fromApp.AppState>, private usersService: UsersService) { }

  ngOnInit(): void {
    if(!this.admin){
      this.admin = this.usersService.getCurrentUser();
    }
  }

  ngOnDestroy(){
    this.state.unsubscribe();
  }

  logOut(){

    const userData: User = JSON.parse(localStorage.getItem('userData') || '{}');
    if(userData.id)
    this.store.dispatch(
      AuthActions.logOut({id: userData.id})
    );

  }

}
