import { UsersService } from './../users/users.service';
import { Injectable } from '@angular/core';
import { CanActivate, UrlTree, Router} from '@angular/router';
import { Observable } from 'rxjs';
import { User } from '../users/user.model';

@Injectable({
  providedIn: 'root'
})
export class ManualAccessGuard implements CanActivate {
currentUser: User;

  constructor(private UsersService: UsersService, private router: Router){}


  canActivate(): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    this.currentUser = this.UsersService.getCurrentUser();

    if(!this.currentUser.id){
      return this.router.createUrlTree(['']);
    }

    return true;


  }

}
