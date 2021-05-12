import { GeneralService } from '../../shared/general.service';
import { Component, OnDestroy, OnInit} from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import * as fromApp from '../../store/app.reducer';
import * as AuthActions from '../store/auth.actions';
import { Subscription } from 'rxjs';
import { environment } from 'src/environments/environment.prod';
import { HttpClient } from '@angular/common/http';
import { User } from 'src/app/users/user.model';
import { map } from 'rxjs/operators';




@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit, OnDestroy{
  registerForm: FormGroup = new FormGroup({username: new FormControl(''),
                                            email: new FormControl(''),
                                          passwordGroup: new FormGroup({
                                            password1: new FormControl(''),
                                            password2: new FormControl('')
                                          })});
  state: Subscription = new Subscription;

  constructor(
    private http: HttpClient,
    private formBuilder: FormBuilder,
    private generalService: GeneralService,
    private store: Store<fromApp.AppState>,
) {}

  ngOnInit(): void {

    this.generalService.redirectToChat();

    this.registerForm = this.formBuilder.group({
      username: ['', Validators.required],
      email: ['',[Validators.required, Validators.email]],
      passwordGroup: this.formBuilder.group({password1: ['',[Validators.required]],
      password2: ['',[Validators.required]]})
    });

    this.registerForm.controls.passwordGroup.setValidators(this.passwordsAreEqual);
    this.registerForm.setAsyncValidators(this.validate);
  }

  ngOnDestroy(){
      this.state.unsubscribe();
  }

  onSubmit(){

     if(this.registerForm.valid){

      const username = this.registerForm.controls["username"].value;
      const email = this.registerForm.controls["email"].value;
      const password1 = this.registerForm.controls["passwordGroup"].value.password1;
      const password2 = this.registerForm.controls["passwordGroup"].value.password2;


      this.store.dispatch(
         AuthActions.register({registerForm: new FormGroup({
          username: new FormControl(username),
          email: new FormControl(email),
          password1: new FormControl(password1),
          password2: new FormControl(password2),

          })
        })
      );

    }

  }

  setUnTouched(){
    this.registerForm.controls["password1"].markAsUntouched();
  }

  setTouched(){
    if(this.registerForm.controls["password1"]){
      if(this.registerForm.controls["password1"].dirty){
        this.registerForm.controls["password1"].markAsTouched();
      }
    }


  }

  passwordsAreEqual(group: FormGroup): {[s: string]: boolean} {
    if(group){
      if(group.controls.password1.value !== group.controls.password2.value){
        return {'passwordsNotEqual': true}
      }
    }
    return null;
  }

  validate = (group: FormGroup) => {
    return this.http.get(environment.APIaccessPoint+'users.json').pipe(map(res=>{
      const usersArray: User[] = this.generalService.apiObjectToArray(res);
      const username = group.controls.username.value;

      let userExistsArray = usersArray.filter(user=>{
        return (user.username === username)
      });
      if(userExistsArray.length !== 0){

        return {'userExists': true};
      }else{

        return null;
      }
    })
  )}

}
