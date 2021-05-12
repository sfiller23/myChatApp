import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { User } from '../user.model';
import * as fromApp from '../../store/app.reducer';
import * as ChatActions from '../../chat/store/chat.actions'
import { ChatBox } from 'src/app/chat/chat-boxes/chat-box.model';
import { UsersService } from '../users.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit , OnDestroy{
  @Input() user: User = null;
  @Input() admin: User = null;
  isActive: boolean = false;
  state: Subscription = new Subscription;
  newMessage: boolean = false;
  newBox: boolean = false;
  lastMessageOwner: User = null;

  constructor(private store: Store<fromApp.AppState>, private usersService: UsersService) { }

  ngOnInit(): void {

    if(!this.admin){
      this.admin = this.usersService.getCurrentUser();
    }

    this.state = this.store.select('chat').subscribe(
      state=>{

        const currentChatBoxes: ChatBox[] = state.chatBoxes;

        const currentUser = this.user;
        let exists = false;
        currentChatBoxes.forEach(box=>{
          if(box.contact.id === currentUser.id || box.admin.id === currentUser.id){
            exists = true;
            this.newMessage = !box.seen;
            if(box.messages.length===1){
              this.newBox = !box.seen;
            }
            this.lastMessageOwner = box.messages[box.messages.length-1].owner;
          }
        });
        if(!exists){
          this.isActive = false;
        }else{
          this.isActive = true;
        }
      }
    )

  }

  onUserClick(contact: User){

    if(!this.isActive){
      this.isActive = true;
      this.store.dispatch(
        ChatActions.openNewChatBox({admin: this.admin, contact: contact})
      )
    }

  }

  ngOnDestroy(){
    this.state.unsubscribe();
  }

}
