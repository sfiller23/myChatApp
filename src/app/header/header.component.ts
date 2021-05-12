import { User } from 'src/app/users/user.model';
import { Subscription } from 'rxjs';
import { Component, OnInit, OnDestroy, Input, DoCheck, EventEmitter, Output } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromApp from '../store/app.reducer';
import * as AuthActions from '../auth/store/auth.actions';
import { UsersService } from '../users/users.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit , OnDestroy, DoCheck{
  @Input() admin: User = null;
  @Output() phoneState = new EventEmitter<{elementName: string}>();
  contactsNumber: number = 0;
  state: Subscription = new Subscription;

  constructor(private store: Store<fromApp.AppState>, private usersService: UsersService) { }

  ngOnInit(): void {
    if(!this.admin){
      this.admin = this.usersService.getCurrentUser();
    }
  }

  ngDoCheck(){
    this.contactsNumber = 0;
    this.state = this.store.select('users').subscribe(
      state=>{
        state.users.forEach(user=>{
          if(user.isLogedin){
            this.contactsNumber++;
          }
        })
      }
    )
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

  toggle(elementName: string){
    this.phoneState.emit({elementName: elementName});
  }

}
