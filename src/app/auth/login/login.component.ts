import { HttpClient } from '@angular/common/http';
import { User } from './../../users/user.model';
import { environment } from './../../../environments/environment.prod';
import { GeneralService } from 'src/app/shared/general.service';
import { Subscription } from 'rxjs';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { AsyncValidator, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import * as fromApp from '../../store/app.reducer';
import * as AuthActions from '../store/auth.actions';
import {map} from 'rxjs/operators';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy, AsyncValidator {
  loginForm: FormGroup = new FormGroup({init: new FormControl('')});
  state: Subscription = new Subscription;

  constructor(private http: HttpClient, private generalService: GeneralService ,private formBuilder: FormBuilder, private store: Store<fromApp.AppState>) { }

  ngOnInit(): void {

    this.generalService.redirectToChat();

    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['',Validators.required]
    });
    this.loginForm.setAsyncValidators(this.validate);
  }

  ngOnDestroy(){
    this.state.unsubscribe();
  }

  onSubmit(){
    if(this.loginForm.valid){
      const username = this.loginForm.controls['username'].value;
      const password = this.loginForm.controls['password'].value;
      this.store.dispatch(
        AuthActions.logIn({username: username, password: password})
      )
    }
  }

  setUnTouched(){
    this.loginForm.controls["password"].markAsUntouched();
  }

  setTouched(){
    if(this.loginForm.controls["password"].dirty){
      this.loginForm.controls["password"].markAsTouched();
    }

  }


  validate = (group: FormGroup) => {
      return this.http.get(environment.APIaccessPoint+'users.json').pipe(map(res=>{
        const usersArray: User[] = this.generalService.apiObjectToArray(res);
        const username = group.controls.username.value;
        const password = group.controls.password.value;
        let userExistsArray = usersArray.filter(user=>{
          return (user.username === username && user.password === password)
        });
        if(userExistsArray.length === 0){
          return {'userNotExists': true};
        }else{
          return null;
        }
      })
    )}
}
