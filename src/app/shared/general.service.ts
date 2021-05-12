import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { User } from '../users/user.model';

@Injectable({
  providedIn: 'root'
})
export class GeneralService {


  constructor(private router: Router) { }


  apiObjectToArray(res: any): any[]{

    const postsArray = [];
    for(const key in res){
      if(res.hasOwnProperty(key)){
        postsArray.push({...res[key], id: key});
      }
    }
    return postsArray;
  }

  findUser(array: any[], username: string, password: string): User | boolean{
    let user: User;

    const currentUser = array.find(user=>{
      return (user.username === username && user.password === password);
    });
    if(!currentUser){
      return false;
    }else{
      user = new User(currentUser.id, currentUser.username, currentUser.email, currentUser.password, true);
    }

    return user;

  }

  redirectToChat(){
    const isOnLine = localStorage.getItem('userData');
    if(isOnLine){
      this.router.navigate(['/chat']);
    }
  }






}


