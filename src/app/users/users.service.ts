import { Injectable } from '@angular/core';
import { User } from './user.model';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor() { }

  getCurrentUser(): User {
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    if(userData.id){
      const user = new User(userData.id, userData.username, userData.email, userData.password, true);
      return user;
    }
    return new User();
  }
}

