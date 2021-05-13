import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { User } from 'src/app/users/user.model';
import { ChatBox } from '../chat-box.model';
import { Message } from './message.model';
import * as fromApp from '../../../store/app.reducer'
import { Subscription } from 'rxjs';
import { UsersService } from 'src/app/users/users.service';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit, OnDestroy {
  @Input() admin: User = null;
  @Input() messages: Message[] = [];
  @Input() chatBox: ChatBox = null;
  @Input() messageLoading: boolean = false;
  state: Subscription = new Subscription;
  lastMessageIndex: number = null;

  constructor(private store: Store<fromApp.AppState>, private usersService: UsersService) { }

  ngOnInit(): void {

    if(!this.admin){
      this.admin = this.usersService.getCurrentUser();
    }

    this.lastMessageIndex = this.messages.length;


    this.state = this.store.select('chat').subscribe(
      state=>{
        if(this.admin){
          state.chatBoxes.forEach(box=>{
            if(this.admin.id === box.admin.id || this.admin.id === box.contact.id){
              if(box.activeSide.admin.isActive || box.activeSide.contact.isActive){
                if(box.messages[box.messages.length-1]){
                  this.messageLoading = false;
                }
              }
            }
            // else if(this.admin.id === box.contact.id){
            //   if(box.activeSide.contact.isActive){
            //     if(box.messages[box.messages.length-1]){
            //       this.messageLoading = false;
            //     }
            //   }
            // }

          })
        }
      }
    )
  }

  ngOnDestroy(){
    this.state.unsubscribe();
  }


}
