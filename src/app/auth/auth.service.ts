import { Injectable } from '@angular/core';

export interface PsaudoUser{
    username: string;
    email: string;
    password: string;
    isLogedin: boolean;
    isAdmin: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() { }



}
